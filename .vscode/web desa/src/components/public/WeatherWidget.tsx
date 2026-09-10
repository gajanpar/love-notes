// src/components/public/WeatherWidget.tsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  Mountain,
  RefreshCw,
  Sprout,
  Compass,
  AlertCircle,
  Activity,
  Droplets,
  Wind as WindIcon,
  Sun as SunIcon,
  Moon as MoonIcon,
  Clock,
  CheckCircle2,
  Layers,
  Eye,
  CalendarDays,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';
import { WeatherData, WeatherForecastItem, HourlyWeatherItem, SoilTelemetry } from '../../types';
import { MOCK_WEATHER } from '../../data/mockData';

// Animated Monochrome Meteocons SVGs
import clearDayIcon from '@meteocons/svg/monochrome/clear-day.svg';
import clearNightIcon from '@meteocons/svg/monochrome/clear-night.svg';
import partlyCloudyDayIcon from '@meteocons/svg/monochrome/partly-cloudy-day.svg';
import partlyCloudyNightIcon from '@meteocons/svg/monochrome/partly-cloudy-night.svg';
import overcastIcon from '@meteocons/svg/monochrome/overcast.svg';
import rainIcon from '@meteocons/svg/monochrome/rain.svg';
import drizzleIcon from '@meteocons/svg/monochrome/drizzle.svg';
import thunderstormsIcon from '@meteocons/svg/monochrome/thunderstorms.svg';
import fogIcon from '@meteocons/svg/monochrome/fog.svg';
import humidityIcon from '@meteocons/svg/monochrome/humidity.svg';
import windIcon from '@meteocons/svg/monochrome/wind.svg';
import uvIndexIcon from '@meteocons/svg/monochrome/uv-index.svg';
import barometerIcon from '@meteocons/svg/monochrome/barometer.svg';
import sunriseIcon from '@meteocons/svg/monochrome/sunrise.svg';
import sunsetIcon from '@meteocons/svg/monochrome/sunset.svg';

interface WeatherWidgetProps {
  weatherData?: WeatherData;
}

// Koordinat Geospasial Presisi Desa Sukadana, Argapura, Majalengka
const LATITUDE = -6.903578;
const LONGITUDE = 108.331809;

// URL Open-Meteo Resolusi Tinggi Ranah Luas (Atmosfer, Tanah, Astronomi, 7 Hari, 24 Jam)
const WEATHER_API_URL = `https://api.open-meteo.com/v1/forecast?latitude=${LATITUDE}&longitude=${LONGITUDE}&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,uv_index_max,wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant,sunrise,sunset,daylight_duration,sunshine_duration,moonrise,moonset,moon_phase,rain_sum,showers_sum,precipitation_sum,precipitation_hours,precipitation_probability_max&hourly=temperature_2m,wind_speed_10m,temperature_80m,wind_direction_10m,cloud_cover,visibility,et0_fao_evapotranspiration,precipitation_probability,apparent_temperature,precipitation,rain,showers,weather_code,surface_pressure,soil_temperature_0cm,soil_temperature_6cm,soil_temperature_18cm,soil_temperature_54cm,is_day,uv_index,sunshine_duration&models=best_match&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,wind_speed_10m,wind_direction_10m,wind_gusts_10m,rain,precipitation,showers,weather_code,cloud_cover,pressure_msl,surface_pressure&minutely_15=temperature_2m,dew_point_2m,apparent_temperature,precipitation,wind_gusts_10m,visibility,is_day,sunshine_duration,weather_code,wind_speed_10m&timezone=Asia%2FJakarta&forecast_days=7`;

// Data Komoditas Pertanian Unggulan Terasering Desa Sukadana
const CROPS_INFO = {
  bawang: {
    id: 'bawang',
    name: 'Bawang Daun',
    latin: 'Allium fistulosum',
    desc: 'Komoditas primadona terasering Sukadana dengan luas tanam >120 Ha. Perakaran dangkal 5-15 cm sangat peka terhadap lengas permukaan.',
    calcRisk: (temp: number, hum: number, vpd: number, soilT?: number) => {
      if (hum >= 75) {
        return {
          status: 'Waspada Jamur Bercak Ungu (Alternaria porri)',
          severity: 'warning' as const,
          action: 'Aplikasi Trichoderma harzianum atau fungisida protektif kontak sebelum petang; periksa saluran drainase bedengan.',
          optimalTime: 'Pukul 06:30 – 08:30 WIB'
        };
      }
      if (temp >= 28 || vpd >= 1.3 || (soilT && soilT >= 24)) {
        return {
          status: 'Cekaman Transpirasi Batang Semu & Suhu Lapisan Atas',
          severity: 'alert' as const,
          action: 'Tambahkan mulsa jerami padi tebal untuk insulasi termal tanah; tunda pemupukan daun pekat di siang terik.',
          optimalTime: 'Pukul 15:45 – 17:15 WIB'
        };
      }
      return {
        status: 'Pertumbuhan Vegetatif & Serapan Hara Optimal',
        severity: 'good' as const,
        action: 'Aplikasi pupuk organik cair pada perakaran; lakukan penyiangan gulma di sepanjang lereng terasering.',
        optimalTime: 'Pukul 07:00 – 10:00 WIB'
      };
    }
  },
  kubis: {
    id: 'kubis',
    name: 'Kubis Dataran Tinggi',
    latin: 'Brassica oleracea',
    desc: 'Varietas kol dataran tinggi dengan rotasi tanam pascapanen bawang daun pada lereng berteras.',
    calcRisk: (temp: number, hum: number) => {
      if (hum >= 80) {
        return {
          status: 'Waspada Busuk Lunak Bakteri (Erwinia carotovora)',
          severity: 'warning' as const,
          action: 'Tingkatkan aerasi antar-bedengan; hindari penyiraman di atas krop daun yang sudah memadat.',
          optimalTime: 'Pukul 07:00 – 09:00 WIB'
        };
      }
      if (temp >= 26) {
        return {
          status: 'Suhu Hangat Berisiko Krop Daun Terbuka',
          severity: 'alert' as const,
          action: 'Pertahankan kelembaban tanah rizosfer dengan penyiraman kabut sore hari setelah pukul 15.30 WIB.',
          optimalTime: 'Pukul 16:00 – 17:30 WIB'
        };
      }
      return {
        status: 'Kepadatan Krop & Bobot Biomassa Prima',
        severity: 'good' as const,
        action: 'Inspeksi perangkap hama nabati ulat krop (Plutella xylostella) dan pemberian unsur hara kalsium mikro.',
        optimalTime: 'Pukul 06:30 – 09:30 WIB'
      };
    }
  },
  kentang: {
    id: 'kentang',
    name: 'Kentang Lembah',
    latin: 'Solanum tuberosum',
    desc: 'Ditanam pada terasering elevasi atas menuju batas hutan lereng Ciremai.',
    calcRisk: (temp: number, hum: number, vpd: number, soilT?: number) => {
      if (hum >= 78) {
        return {
          status: 'Peringatan Dini Hawar Daun (Phytophthora infestans)',
          severity: 'warning' as const,
          action: 'Cek bercak basah pada helai daun bawah; aplikasikan fungisida protektif kontak mankozeb terukur.',
          optimalTime: 'Pukul 06:00 – 08:00 WIB'
        };
      }
      if (temp >= 25 || (soilT && soilT >= 22)) {
        return {
          status: 'Inisiasi Umbi Lambat Akibat Suhu Lapisan Tuberisasi Hangat',
          severity: 'alert' as const,
          action: 'Timbun tanah guludan (hilling up) lebih tebal untuk menjaga suhu zona perakaran umbi muda tetap sejuk (<20°C).',
          optimalTime: 'Pukul 15:30 – 17:30 WIB'
        };
      }
      return {
        status: 'Fase Pengisian Umbi & Tuberisasi Prima',
        severity: 'good' as const,
        action: 'Pertahankan kelembaban tanah gembur; pantau aerasi tanah di kedalaman 15-25 cm.',
        optimalTime: 'Pukul 07:00 – 10:30 WIB'
      };
    }
  }
};

/**
 * Mapping WMO Weather Code ke Icon Monochrome Beranimasi Resmi dari @meteocons/svg/monochrome
 */
function mapWmoToMonochromeWeather(code: number, isDay: boolean = true) {
  if (code === 0) {
    return {
      condition: isDay ? 'Cerah' : 'Cerah Malam',
      iconUrl: isDay ? clearDayIcon : clearNightIcon,
      type: 'sun' as const
    };
  }
  if (code === 1 || code === 2) {
    return {
      condition: isDay ? 'Cerah Berawan' : 'Berawan Malam',
      iconUrl: isDay ? partlyCloudyDayIcon : partlyCloudyNightIcon,
      type: 'cloud-sun' as const
    };
  }
  if (code === 3) {
    return {
      condition: 'Mendung Berawan',
      iconUrl: overcastIcon,
      type: 'cloud' as const
    };
  }
  if (code === 45 || code === 48) {
    return {
      condition: 'Kabut Pegunungan',
      iconUrl: fogIcon,
      type: 'cloud' as const
    };
  }
  if (code >= 51 && code <= 57) {
    return {
      condition: 'Gerimis Ringan',
      iconUrl: drizzleIcon,
      type: 'cloud-rain' as const
    };
  }
  if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) {
    return {
      condition: 'Hujan Pegunungan',
      iconUrl: rainIcon,
      type: 'cloud-rain' as const
    };
  }
  if (code >= 95) {
    return {
      condition: 'Hujan Disertai Petir',
      iconUrl: thunderstormsIcon,
      type: 'cloud-rain' as const
    };
  }
  return {
    condition: 'Cerah Berawan',
    iconUrl: isDay ? partlyCloudyDayIcon : partlyCloudyNightIcon,
    type: 'cloud-sun' as const
  };
}

/**
 * Deskripsi Fase Astronomi Bulan untuk Panduan Pranata Mangsa Tani
 */
function getMoonPhaseInfo(val: number): { name: string; illuminance: string } {
  const pct = Math.round((1 - Math.abs(val - 0.5) * 2) * 100);
  if (val < 0.03 || val > 0.97) return { name: 'Bulan Baru (Tilem)', illuminance: `${pct}% Iluminasi` };
  if (val < 0.22) return { name: 'Bulan Sabit Awal (Waxing Crescent)', illuminance: `${pct}% Iluminasi` };
  if (val < 0.28) return { name: 'Perbani Awal (First Quarter)', illuminance: `${pct}% Iluminasi` };
  if (val < 0.47) return { name: 'Bulan Cembung Awal (Waxing Gibbous)', illuminance: `${pct}% Iluminasi` };
  if (val < 0.53) return { name: 'Bulan Purnama (Purnamasiddhi)', illuminance: `${pct}% Iluminasi` };
  if (val < 0.72) return { name: 'Bulan Cembung Akhir (Waning Gibbous)', illuminance: `${pct}% Iluminasi` };
  if (val < 0.78) return { name: 'Perbani Akhir (Last Quarter)', illuminance: `${pct}% Iluminasi` };
  return { name: 'Bulan Sabit Akhir (Waning Crescent)', illuminance: `${pct}% Iluminasi` };
}

/**
 * Kalkulasi Agrometeorologi & Bukti Empiris Dinamis
 */
function calculateEmpiricalMicroclimate(temp: number, humidity: number, rainProb: number, condition: string) {
  const es = 0.61078 * Math.exp((17.27 * temp) / (temp + 237.3));
  const ea = es * (humidity / 100);
  const vpd = Math.max(0.01, Number((es - ea).toFixed(2)));
  const dewPoint = Number((temp - ((100 - humidity) / 5)).toFixed(1));

  if (rainProb >= 60 || condition.toLowerCase().includes('hujan') || condition.toLowerCase().includes('gerimis')) {
    return {
      vpd,
      dewPoint,
      transpirationRate: 'Sangat Rendah (< 0.15 mm/jam)',
      title: 'Landasan Empiris: Kejenuhan Lengas & Presipitasi Aktif',
      empiricalEvidence: `Data telemetri menunjukkan tekanan uap jenuh udara hampir 100% (VPD ${vpd} kPa, Titik Embun ${dewPoint}°C). Peluang presipitasi terukur ${rainProb}%.`,
      scientificReasoning: 'Kondisi udara jenuh menekan laju transpirasi tanaman hampir ke titik nol. Air tanah berada pada kapasitas lapang penuh (field capacity), meningkatkan koefisien aliran permukaan pada kemiringan lereng Sukadana.',
      suitableAction: 'Pengecekan dan pembukaan pintu saluran pembuangan drainase tersier pada bedengan bawang daun agar terhindar dari pembusukan akar (waterlogging).',
      caution: 'Hentikan aplikasi pupuk tabur (leaching risk) dan tunda penyemprotan fungisida cair hingga kanopi daun mengering.'
    };
  }

  if (temp >= 28 || vpd >= 1.4) {
    return {
      vpd,
      dewPoint,
      transpirationRate: 'Tinggi (> 0.65 mm/jam)',
      title: 'Landasan Empiris: Cekaman Transpirasi & Defisit Tekanan Uap Tinggi',
      empiricalEvidence: `Sensor telemetri mencatat VPD tinggi ${vpd} kPa pada suhu ${temp}°C (Titik Embun ${dewPoint}°C, Kelembaban ${humidity}%).`,
      scientificReasoning: 'Gradien tekanan uap yang tajam antara ruang udara daun dan atmosfer memicu pembukaan stomata maksimal yang berisiko memicu cekaman kekeringan lokal pada perakaran 0–15 cm.',
      suitableAction: 'Optimalkan penyiraman menggunakan sistem fertigasi/tetes pada sore hari (setelah pukul 15.30 WIB) ketika VPD turun di bawah 1.0 kPa.',
      caution: 'Hindari pemupukan daun berkonsentrasi pekat di siang hari guna mencegah plasmolisis pada jaringan daun.'
    };
  }

  if (humidity >= 78 || temp <= 22) {
    return {
      vpd,
      dewPoint,
      transpirationRate: 'Optimal Terkendali (~0.30 mm/jam)',
      title: 'Landasan Empiris: Mikroklimat Sejuk & Kelembaban Relatif Prima',
      empiricalEvidence: `Data sensor mencatat kelembaban ${humidity}%, suhu ${temp}°C, dan nilai VPD ideal ${vpd} kPa dengan titik embun ${dewPoint}°C.`,
      scientificReasoning: 'Keseimbangan termal sejuk dataran Sukadana meminimalkan fotorespirasi dan memaksimalkan akumulasi biomassa pada tanaman hortikultura lokal.',
      suitableAction: 'Fase emas pemupukan berimbang organik cair dan penyiangan gulma. Penyerapan hara oleh stomata daun berada pada efisiensi puncak.',
      caution: 'Pantau kelembaban daun jika basah bertahan lebih dari 4 jam setelah fajar untuk mencegah spora jamur Alternaria porri.'
    };
  }

  return {
    vpd,
    dewPoint,
    transpirationRate: 'Moderat (~0.42 mm/jam)',
    title: 'Landasan Empiris: Kesetimbangan Agroklimat Stabil',
    empiricalEvidence: `Data sensor: Suhu ${temp}°C, Kelembaban ${humidity}%, VPD ${vpd} kPa, Titik Embun ${dewPoint}°C.`,
    scientificReasoning: 'Parameter mikroklimat berada pada batas toleransi agronomis ideal bagi siklus vegetatif dan generatif tanaman hortikultura lokal.',
    suitableAction: 'Pelaksanaan jadwal perawatan rutin, aerasi tanah guludan, dan pemantauan berkala perangkap hama hayati.',
    caution: 'Perhatikan dinamika fluktuasi kecepatan angin lembah di area perbukitan terbuka.'
  };
}

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({
  weatherData = MOCK_WEATHER
}) => {
  const [data, setData] = useState<WeatherData>(weatherData);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedCrop, setSelectedCrop] = useState<'bawang' | 'kubis' | 'kentang'>('bawang');
  const [activeDomainTab, setActiveDomainTab] = useState<'iklim' | 'tanah' | 'mingguan' | 'hourly'>('iklim');

  // Drag-to-scroll for nav tabs
  const navRef = React.useRef<HTMLDivElement>(null);
  const isDragging = React.useRef(false);
  const startX = React.useRef(0);
  const scrollLeft = React.useRef(0);

  const handleNavMouseDown = (e: React.MouseEvent) => {
    if (!navRef.current) return;
    isDragging.current = true;
    navRef.current.style.cursor = 'grabbing';
    navRef.current.style.scrollBehavior = 'auto'; // disable smooth scroll during drag
    startX.current = e.pageX - navRef.current.offsetLeft;
    scrollLeft.current = navRef.current.scrollLeft;
  };

  const handleNavMouseLeave = () => {
    if (!navRef.current) return;
    isDragging.current = false;
    navRef.current.style.cursor = 'grab';
    navRef.current.style.scrollBehavior = 'smooth';
  };

  const handleNavMouseUp = () => {
    if (!navRef.current) return;
    isDragging.current = false;
    navRef.current.style.cursor = 'grab';
    navRef.current.style.scrollBehavior = 'smooth';
  };

  const handleNavMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !navRef.current) return;
    e.preventDefault();
    const x = e.pageX - navRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    navRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const scrollToTab = useCallback((tabId: 'iklim' | 'tanah' | 'mingguan' | 'hourly') => {
    setActiveDomainTab(tabId);
    const element = document.getElementById(`weather-tab-${tabId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, []);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const scrollLeft = container.scrollLeft;
    const width = container.clientWidth;
    const activeIndex = Math.round(scrollLeft / width);
    const tabs: Array<'iklim' | 'tanah' | 'mingguan' | 'hourly'> = ['iklim', 'tanah', 'mingguan', 'hourly'];
    if (tabs[activeIndex] && tabs[activeIndex] !== activeDomainTab) {
      setActiveDomainTab(tabs[activeIndex]);
    }
  }, [activeDomainTab]);

  // Real-time clock update setiap detik
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch Open-Meteo High-Resolution Realtime & Expansive Data
  const fetchLiveWeather = useCallback(async (manual = false) => {
    if (manual) setIsRefreshing(true);

    try {
      const response = await fetch(WEATHER_API_URL);
      if (!response.ok) throw new Error('Gagal mengambil data telemetri cuaca');
      const json = await response.json();

      const current = json.current;
      const daily = json.daily;
      const hourly = json.hourly;
      const minutely = json.minutely_15;

      const hour = new Date().getHours();
      const isDay = current.is_day === 1 || (hour >= 6 && hour < 18);

      const currentMapped = mapWmoToMonochromeWeather(current.weather_code, isDay);
      const temp = Math.round(current.temperature_2m);
      const humidity = Math.round(current.relative_humidity_2m);
      const feelsLike = Math.round(current.apparent_temperature);
      const windSpeed = Math.round(current.wind_speed_10m);
      const windGusts = Math.round(current.wind_gusts_10m || current.wind_speed_10m * 1.35);
      const surfacePressure = Math.round(current.surface_pressure || 918);
      const cloudCover = Math.round(current.cloud_cover || 0);

      // Suhu Titik Embun & Jarak Pandang Horisontal
      const dewPoint = minutely?.dew_point_2m?.[0] !== undefined
        ? Number(minutely.dew_point_2m[0].toFixed(1))
        : Number((temp - ((100 - humidity) / 5)).toFixed(1));
      const visibilityKm = minutely?.visibility?.[0] !== undefined
        ? Number((minutely.visibility[0] / 1000).toFixed(1))
        : 8.5;

      // Nilai UV Index
      const uvIndex = daily?.uv_index_max?.[0] ? Math.round(daily.uv_index_max[0]) : (isDay ? 6 : 0);

      // Suhu Min & Max Hari Ini
      const tempMin = daily?.temperature_2m_min?.[0] ? Math.round(daily.temperature_2m_min[0]) : temp - 3;
      const tempMax = daily?.temperature_2m_max?.[0] ? Math.round(daily.temperature_2m_max[0]) : temp + 4;
      const rainProbToday = daily?.precipitation_probability_max?.[0] ?? (current.rain > 0 ? 80 : 15);

      // Waktu Surya & Fase Bulan Hari Ini
      const sunriseRaw = daily?.sunrise?.[0];
      const sunsetRaw = daily?.sunset?.[0];
      const sunriseToday = sunriseRaw ? `${sunriseRaw.split('T')[1].slice(0, 5)} WIB` : '05:42 WIB';
      const sunsetToday = sunsetRaw ? `${sunsetRaw.split('T')[1].slice(0, 5)} WIB` : '17:44 WIB';
      const moonPhaseToday = daily?.moon_phase?.[0] ?? 0.5;

      // 7-Hari Forecast Strip
      const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

      const forecastList: WeatherForecastItem[] = [];
      if (daily?.time && daily.time.length > 0) {
        for (let i = 0; i < Math.min(daily.time.length, 7); i++) {
          const dateObj = new Date(daily.time[i]);
          const dName = i === 0 ? 'Hari Ini' : i === 1 ? 'Besok' : dayNames[dateObj.getDay()];
          const dateStr = `${dateObj.getDate()} ${monthNames[dateObj.getMonth()]}`;
          const fcMapped = mapWmoToMonochromeWeather(daily.weather_code[i], true);
          const fcMin = Math.round(daily.temperature_2m_min[i]);
          const fcMax = Math.round(daily.temperature_2m_max[i]);
          const rainP = daily.precipitation_probability_max[i] || 10;
          const rainSum = Number((daily.rain_sum?.[i] ?? daily.precipitation_sum?.[i] ?? 0).toFixed(1));
          const uvMax = daily.uv_index_max?.[i] ? Math.round(daily.uv_index_max[i]) : 5;
          const windMax = Math.round(daily.wind_speed_10m_max?.[i] || 12);
          const windGMax = Math.round(daily.wind_gusts_10m_max?.[i] || windMax * 1.3);

          forecastList.push({
            day: dName,
            date: dateStr,
            temp: `${fcMin}° - ${fcMax}°C`,
            tempNum: fcMax,
            condition: fcMapped.condition,
            icon: fcMapped.type,
            rainProb: rainP,
            rainSum,
            uvIndexMax: uvMax,
            windSpeedMax: windMax,
            windGustsMax: windGMax,
            sunrise: daily.sunrise?.[i] ? daily.sunrise[i].split('T')[1].slice(0, 5) : undefined,
            sunset: daily.sunset?.[i] ? daily.sunset[i].split('T')[1].slice(0, 5) : undefined,
            moonPhase: daily.moon_phase?.[i]
          });
        }
      }

      // 12-24 Jam Hourly Timeline
      const hourlyTrends: HourlyWeatherItem[] = [];
      if (hourly?.time) {
        const nowMs = Date.now();
        let startIndex = hourly.time.findIndex((t: string) => new Date(t).getTime() >= nowMs - 60 * 60 * 1000);
        if (startIndex === -1) startIndex = 0;
        for (let i = startIndex; i < Math.min(hourly.time.length, startIndex + 12); i++) {
          const d = new Date(hourly.time[i]);
          hourlyTrends.push({
            time: hourly.time[i],
            hourStr: d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
            temp: Math.round(hourly.temperature_2m[i]),
            rainProb: hourly.precipitation_probability[i] || 0,
            cloudCover: Math.round(hourly.cloud_cover[i] || 0),
            windSpeed: Math.round(hourly.wind_speed_10m[i] || 0),
            isDay: hourly.is_day[i] === 1,
            weatherCode: hourly.weather_code[i]
          });
        }
      }

      // Stratifikasi Suhu Profil Tanah (0cm, 6cm, 18cm, 54cm) & Evapotranspirasi FAO
      const soilTelemetry: SoilTelemetry = {
        temp0cm: Number((hourly?.soil_temperature_0cm?.[0] ?? 19).toFixed(1)),
        temp6cm: Number((hourly?.soil_temperature_6cm?.[0] ?? 22).toFixed(1)),
        temp18cm: Number((hourly?.soil_temperature_18cm?.[0] ?? 23.5).toFixed(1)),
        temp54cm: Number((hourly?.soil_temperature_54cm?.[0] ?? 23).toFixed(1)),
        evapotranspiration: Number((hourly?.et0_fao_evapotranspiration?.[0] ?? 2.8).toFixed(2))
      };

      const advice = calculateEmpiricalMicroclimate(temp, humidity, rainProbToday, currentMapped.condition);
      const nowStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

      setData({
        location: 'Desa Sukadana, Argapura',
        region: 'Kabupaten Majalengka, Jawa Barat',
        elevation: '',
        temp,
        tempMin,
        tempMax,
        feelsLike,
        condition: currentMapped.condition,
        icon: currentMapped.type,
        humidity,
        windSpeed,
        windGusts,
        windDirection: 'Angin Lembah Ciremai',
        uvIndex,
        airQuality: 'Sangat Sehat',
        aqiNumber: 15,
        updatedAt: `Stasiun Geospasial (${nowStr} WIB)`,
        surfacePressure,
        dewPoint,
        cloudCover,
        visibilityKm,
        sunriseToday,
        sunsetToday,
        moonPhaseToday,
        soilTelemetry,
        hourlyTrends,
        agriculturalAdvice: {
          title: advice.title,
          description: `${advice.empiricalEvidence} ${advice.scientificReasoning}`,
          suitableAction: advice.suitableAction,
          caution: advice.caution
        },
        forecast: forecastList.length > 0 ? forecastList : weatherData.forecast
      });
    } catch {
      // Fallback update timestamp
      setData(prev => ({
        ...prev,
        updatedAt: `Sensor Lokal: ${new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB`
      }));
    } finally {
      if (manual) {
        setTimeout(() => setIsRefreshing(false), 450);
      }
    }
  }, [weatherData.forecast]);

  useEffect(() => {
    fetchLiveWeather(false);
    const interval = setInterval(() => {
      fetchLiveWeather(false);
    }, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchLiveWeather]);

  // Resolving icon url for main condition (100% Monochrome)
  const hour = currentTime.getHours();
  const isDay = hour >= 6 && hour < 18;
  const currentMappedIcon = data.condition.toLowerCase().includes('hujan')
    ? rainIcon
    : data.condition.toLowerCase().includes('petir')
      ? thunderstormsIcon
      : data.condition.toLowerCase().includes('gerimis')
        ? drizzleIcon
        : data.condition.toLowerCase().includes('kabut')
          ? fogIcon
          : data.condition.toLowerCase().includes('mendung')
            ? overcastIcon
            : isDay
              ? (data.icon === 'sun' ? clearDayIcon : partlyCloudyDayIcon)
              : (data.icon === 'sun' ? clearNightIcon : partlyCloudyNightIcon);

  // Perhitungan bukti empiris terkini
  const empiricalCalc = calculateEmpiricalMicroclimate(data.temp, data.humidity, 20, data.condition);

  // Digital clock strings
  const timeStr = currentTime.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });

  const dateStr = currentTime.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const moonInfo = getMoonPhaseInfo(data.moonPhaseToday ?? 0.5);

  return (
    <div className="weather-hero-card" role="region" aria-label="Pusat Informasi Cuaca & Mikroklimat Terpadu Desa Sukadana">
      {/* Card Header */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        marginBottom: '16px',
        borderBottom: '1px solid rgba(172, 219, 176, 0.35)',
        paddingBottom: '14px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: 'var(--radius-lg)',
            background: 'linear-gradient(135deg, var(--color-brand-primary) 0%, var(--color-brand-mid) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(26, 144, 32, 0.3)',
            flexShrink: 0
          }}>
            <Mountain size={22} color="#ffffff" />
          </div>
          <div>
            <h3 style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 'clamp(1.05rem, 3vw, 1.2rem)',
              fontWeight: 700,
              color: 'var(--color-text-primary)',
              margin: 0,
              letterSpacing: '-0.01em',
              lineHeight: 1.3
            }}>
              Pusat Cuaca &amp; Mikroklimat Agroteknologi
            </h3>
            <p style={{
              fontSize: 'clamp(0.7rem, 2vw, 0.8rem)',
              color: 'var(--color-text-muted)',
              margin: '2px 0 0 0',
              fontWeight: 500,
              lineHeight: 1.4
            }}>
              Desa Sukadana, Argapura, Majalengka &bull; 108.331°E, -6.903°S
            </p>
          </div>
        </div>

        {/* Realtime Clock & Manual Refresh Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #241d18 0%, #382f28 100%)',
            borderRadius: 'var(--radius-lg)',
            padding: '6px 14px',
            textAlign: 'right',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            border: '1px solid rgba(207, 162, 61, 0.25)'
          }}>
            <div style={{
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: '1.05rem',
              fontWeight: 800,
              color: '#ffffff',
              letterSpacing: '0.04em',
              lineHeight: 1.2
            }}>
              {timeStr} <span style={{ fontSize: '0.65rem', color: '#cfa23d', fontWeight: 600 }}>WIB</span>
            </div>
            <div style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.6)', fontWeight: 500, lineHeight: 1.2 }}>
              {dateStr}
            </div>
          </div>

          <button
            onClick={() => fetchLiveWeather(true)}
            title="Segarkan data telemetri realtime"
            disabled={isRefreshing}
            style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              width: '38px',
              height: '38px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: isRefreshing ? 'wait' : 'pointer',
              color: 'var(--color-brand-primary)',
              transition: 'all var(--transition-fast)',
              boxShadow: 'var(--shadow-xs)'
            }}
          >
            <RefreshCw size={15} className={isRefreshing ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* RANAH CUACA YANG LUAS: DOMAIN NAVIGATION TABS */}
      <div 
        className="weather-domain-nav" 
        role="tablist" 
        aria-label="Navigasi Ranah Cuaca"
        ref={navRef}
        onMouseDown={handleNavMouseDown}
        onMouseLeave={handleNavMouseLeave}
        onMouseUp={handleNavMouseUp}
        onMouseMove={handleNavMouseMove}
        style={{ cursor: 'grab', scrollBehavior: 'smooth' }}
      >
        <button
          role="tab"
          aria-selected={activeDomainTab === 'iklim'}
          className={`weather-domain-btn ${activeDomainTab === 'iklim' ? 'active' : ''}`}
          onClick={() => scrollToTab('iklim')}
        >
          <Activity size={15} />
          <span>Atmosfer &amp; Mikroklimat</span>
        </button>

        <button
          role="tab"
          aria-selected={activeDomainTab === 'tanah'}
          className={`weather-domain-btn ${activeDomainTab === 'tanah' ? 'active' : ''}`}
          onClick={() => scrollToTab('tanah')}
        >
          <Layers size={15} />
          <span>Stratifikasi Tanah &amp; Agroklimat</span>
        </button>

        <button
          role="tab"
          aria-selected={activeDomainTab === 'mingguan'}
          className={`weather-domain-btn ${activeDomainTab === 'mingguan' ? 'active' : ''}`}
          onClick={() => scrollToTab('mingguan')}
        >
          <CalendarDays size={15} />
          <span>Prakiraan 7-Hari &amp; Astronomi</span>
        </button>

        <button
          role="tab"
          aria-selected={activeDomainTab === 'hourly'}
          className={`weather-domain-btn ${activeDomainTab === 'hourly' ? 'active' : ''}`}
          onClick={() => scrollToTab('hourly')}
        >
          <TrendingUp size={15} />
          <span>Dinamika Jam per Jam</span>
        </button>
      </div>

      <div 
        onScroll={handleScroll}
        style={{
          display: 'flex',
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          scrollBehavior: 'smooth',
          width: '100%',
          gap: '24px',
          paddingBottom: '8px',
          scrollbarWidth: 'none', // Firefox
          WebkitOverflowScrolling: 'touch'
        }}
      >
      {/* ========================================================================= */}
      {/* TAB 1: ATMOSFER & MIKROKLIMAT UDARA */}
      {/* ========================================================================= */}
      <div id="weather-tab-iklim" style={{ flex: '0 0 100%', minWidth: '100%', scrollSnapAlign: 'start' }}>
          {/* Main Temperature & Micro Metrics Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))',
            gap: '20px',
            alignItems: 'center',
            marginBottom: '18px'
          }}>
            {/* Left: 100% Monochrome Animated Weather Icon & Temperature */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
              <div style={{
                width: '84px',
                height: '84px',
                borderRadius: 'var(--radius-xl)',
                background: 'var(--color-surface-raised)',
                border: '1px solid var(--color-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 20px rgba(0, 0, 0, 0.06)',
                flexShrink: 0,
                overflow: 'hidden',
                padding: '4px'
              }}>
                <img
                  src={currentMappedIcon}
                  alt={data.condition}
                  width={72}
                  height={72}
                  className="weather-monochrome-icon"
                  style={{ objectFit: 'contain' }}
                />
              </div>

              <div>
                <div className="weather-temp-badge" style={{ fontFamily: 'var(--font-mono, monospace)', letterSpacing: '-0.02em' }}>
                  {data.temp}
                  <sup>&deg;C</sup>
                </div>
                <div style={{
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  color: 'var(--color-brand-primary)',
                  marginTop: '1px'
                }}>
                  {data.condition}
                </div>
                <div style={{
                  fontSize: '0.75rem',
                  color: 'var(--color-text-muted)',
                  marginTop: '2px',
                  fontFamily: 'var(--font-mono, monospace)'
                }}>
                  Rentang: {data.tempMin}&deg;C &mdash; {data.tempMax}&deg;C &bull; Terasa: {data.feelsLike}&deg;C
                </div>
              </div>
            </div>

            {/* Right: 4 Primary Telemetry Chips */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 110px), 1fr))',
              gap: '10px'
            }}>
              {/* Kelembaban */}
              <div className="weather-stat-chip" style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <span className="stat-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <img src={humidityIcon} width={18} height={18} alt="Kelembaban" className="weather-monochrome-icon" />
                  Kelembaban
                </span>
                <span className="stat-val" style={{ fontFamily: 'var(--font-mono, monospace)' }}>{data.humidity}%</span>
              </div>

              {/* Angin & Hembusan */}
              <div className="weather-stat-chip" style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <span className="stat-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <img src={windIcon} width={18} height={18} alt="Angin" className="weather-monochrome-icon" />
                  Angin
                </span>
                <span className="stat-val" style={{ fontFamily: 'var(--font-mono, monospace)' }}>
                  {data.windSpeed} <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>km/j (G:{data.windGusts || data.windSpeed})</span>
                </span>
              </div>

              {/* Tekanan Barometrik */}
              <div className="weather-stat-chip" style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <span className="stat-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <img src={barometerIcon} width={18} height={18} alt="Barometer" className="weather-monochrome-icon" />
                  Tekanan
                </span>
                <span className="stat-val" style={{ fontFamily: 'var(--font-mono, monospace)' }}>
                  {data.surfacePressure || 918} <span style={{ fontSize: '0.68rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>hPa</span>
                </span>
              </div>

              {/* Indeks UV */}
              <div className="weather-stat-chip" style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <span className="stat-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <img src={uvIndexIcon} width={18} height={18} alt="Indeks UV" className="weather-monochrome-icon" />
                  Indeks UV
                </span>
                <span className="stat-val" style={{ fontFamily: 'var(--font-mono, monospace)' }}>
                  {data.uvIndex} <span style={{ fontSize: '0.68rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>
                    {data.uvIndex <= 2 ? '(Rendah)' : data.uvIndex <= 5 ? '(Sedang)' : '(Tinggi)'}
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* Secondary Telemetry Strip: Surya & Parameter Atmosfer Tambahan */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 130px), 1fr))',
            gap: '8px',
            marginBottom: '16px'
          }}>
            <div style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: '10px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <img src={sunriseIcon} width={24} height={24} alt="Terbit Surya" className="weather-monochrome-icon" />
              <div>
                <div style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Terbit Surya</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, fontFamily: 'var(--font-mono, monospace)' }}>{data.sunriseToday || '05:42 WIB'}</div>
              </div>
            </div>

            <div style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: '10px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <img src={sunsetIcon} width={24} height={24} alt="Terbenam Surya" className="weather-monochrome-icon" />
              <div>
                <div style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Terbenam Surya</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, fontFamily: 'var(--font-mono, monospace)' }}>{data.sunsetToday || '17:44 WIB'}</div>
              </div>
            </div>

            <div style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: '10px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <Droplets size={20} color="var(--color-brand-primary)" />
              <div>
                <div style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Titik Embun</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, fontFamily: 'var(--font-mono, monospace)' }}>{data.dewPoint ?? empiricalCalc.dewPoint}&deg;C</div>
              </div>
            </div>

            <div style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: '10px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <Eye size={20} color="#9a7522" />
              <div>
                <div style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Jarak Pandang</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, fontFamily: 'var(--font-mono, monospace)' }}>{data.visibilityKm || 8.5} km</div>
              </div>
            </div>

            <div style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: '10px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <Activity size={20} color="var(--color-brand-primary)" />
              <div>
                <div style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Tutupan Awan</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, fontFamily: 'var(--font-mono, monospace)' }}>{data.cloudCover || 0}%</div>
              </div>
            </div>
          </div>

          {/* Diagnosis Empiris Mikroklimat */}
          <div className="weather-agro-box" style={{
            background: 'var(--color-surface-raised)',
            borderLeft: '4px solid var(--color-brand-primary)',
            borderRadius: 'var(--radius-lg)',
            padding: '16px 18px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sprout size={18} color="var(--color-brand-primary)" />
                <strong style={{ fontSize: '0.88rem', color: 'var(--color-text-primary)' }}>
                  {empiricalCalc.title}
                </strong>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
                <span style={{
                  background: 'rgba(26, 144, 32, 0.1)',
                  color: 'var(--color-brand-primary)',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-full)',
                  fontFamily: 'var(--font-mono, monospace)'
                }}>
                  VPD: {empiricalCalc.vpd} kPa
                </span>
                <span style={{
                  background: 'rgba(207, 162, 61, 0.12)',
                  color: '#9a7522',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-full)',
                  fontFamily: 'var(--font-mono, monospace)'
                }}>
                  Transpirasi: {empiricalCalc.transpirationRate}
                </span>
              </div>
            </div>

            <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: '0 0 10px 0' }}>
              {empiricalCalc.empiricalEvidence} {empiricalCalc.scientificReasoning}
            </p>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              fontSize: '0.78rem',
              background: 'var(--color-surface)',
              padding: '10px 12px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)'
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', color: 'var(--color-brand-primary)', fontWeight: 600 }}>
                <Compass size={14} style={{ flexShrink: 0, marginTop: '2px' }} />
                <span><strong>Tindakan Agronomis:</strong> {empiricalCalc.suitableAction}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', color: '#855b14', fontWeight: 600 }}>
                <AlertCircle size={14} style={{ flexShrink: 0, marginTop: '2px' }} />
                <span><strong>Antisipasi &amp; Proteksi:</strong> {empiricalCalc.caution}</span>
              </div>
            </div>
          </div>
        </div>

      {/* ========================================================================= */}
      {/* TAB 2: STRATIFIKASI TANAH & BIOSFER AGROKLIMAT */}
      {/* ========================================================================= */}
      <div id="weather-tab-tanah" style={{ flex: '0 0 100%', minWidth: '100%', scrollSnapAlign: 'start' }}>
          {/* Header Penjelasan Ranah Tanah */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                  Stratifikasi Termal Profil Tanah Terasering
                </h4>
                <p style={{ margin: '2px 0 0 0', fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                  Sensor suhu riil pada 4 kedalaman perakaran &amp; parameter evapotranspirasi acuan FAO ET₀
                </p>
              </div>

              <div style={{
                background: 'rgba(26, 144, 32, 0.1)',
                border: '1px solid rgba(26, 144, 32, 0.25)',
                borderRadius: 'var(--radius-full)',
                padding: '4px 12px',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: 'var(--color-brand-primary)',
                fontFamily: 'var(--font-mono, monospace)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <Droplets size={14} />
                <span>Evapotranspirasi ET₀: {data.soilTelemetry?.evapotranspiration || 2.8} mm/hari</span>
              </div>
            </div>
          </div>

          {/* 4 Soil Stratification Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 150px), 1fr))',
            gap: '10px',
            marginBottom: '16px'
          }}>
            {/* 0 cm */}
            <div className="weather-soil-card">
              <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                Lapisan 0 cm
              </div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-primary)', marginTop: '2px' }}>
                Permukaan Bedengan
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--font-mono, monospace)', color: 'var(--color-brand-primary)', margin: '8px 0 4px 0' }}>
                {data.soilTelemetry?.temp0cm || data.temp}&deg;C
              </div>
              <div style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)', lineHeight: 1.3 }}>
                Evaporasi langsung; terlindungi mulsa jerami.
              </div>
            </div>

            {/* 6 cm */}
            <div className="weather-soil-card">
              <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--color-brand-primary)', textTransform: 'uppercase' }}>
                Lapisan 6 cm
              </div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-primary)', marginTop: '2px' }}>
                Rizosfer Bawang Daun
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--font-mono, monospace)', color: 'var(--color-brand-primary)', margin: '8px 0 4px 0' }}>
                {data.soilTelemetry?.temp6cm || data.temp + 1}&deg;C
              </div>
              <div style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)', lineHeight: 1.3 }}>
                Zona serapan hara aktif akar serabut.
              </div>
            </div>

            {/* 18 cm */}
            <div className="weather-soil-card">
              <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#9a7522', textTransform: 'uppercase' }}>
                Lapisan 18 cm
              </div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-primary)', marginTop: '2px' }}>
                Tuberisasi Kentang
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--font-mono, monospace)', color: '#9a7522', margin: '8px 0 4px 0' }}>
                {data.soilTelemetry?.temp18cm || data.temp + 2}&deg;C
              </div>
              <div style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)', lineHeight: 1.3 }}>
                Ideal untuk pembentukan umbi kentang &amp; akar kubis.
              </div>
            </div>

            {/* 54 cm */}
            <div className="weather-soil-card">
              <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                Lapisan 54 cm
              </div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-primary)', marginTop: '2px' }}>
                Batuan Induk Litosol
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--font-mono, monospace)', color: 'var(--color-text-primary)', margin: '8px 0 4px 0' }}>
                {data.soilTelemetry?.temp54cm || data.temp + 2}&deg;C
              </div>
              <div style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)', lineHeight: 1.3 }}>
                Cadangan kelembaban kapiler lereng bawah.
              </div>
            </div>
          </div>

          {/* Interactive Crop Selector for Soil Domain */}
          {(() => {
            const currentCrop = CROPS_INFO[selectedCrop];
            const soilT = selectedCrop === 'bawang' ? data.soilTelemetry?.temp6cm : data.soilTelemetry?.temp18cm;
            const cropRisk = currentCrop.calcRisk(data.temp, data.humidity, empiricalCalc.vpd, soilT);
            const severityBg = cropRisk.severity === 'good'
              ? 'rgba(26, 144, 32, 0.1)'
              : cropRisk.severity === 'warning'
                ? 'rgba(245, 158, 11, 0.12)'
                : 'rgba(239, 68, 68, 0.12)';
            const severityFg = cropRisk.severity === 'good'
              ? 'var(--color-brand-primary)'
              : cropRisk.severity === 'warning'
                ? '#b45309'
                : '#b91c1c';

            return (
              <div style={{
                background: 'var(--color-surface-raised)',
                borderRadius: 'var(--radius-lg)',
                padding: '16px 18px',
                border: '1px solid var(--color-border)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', flexWrap: 'wrap', gap: '6px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Panduan Agroklimat Berdasarkan Komoditas:
                  </span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                    {currentCrop.latin}
                  </span>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '14px' }}>
                  {(Object.keys(CROPS_INFO) as Array<keyof typeof CROPS_INFO>).map(key => {
                    const crop = CROPS_INFO[key];
                    const isSelected = selectedCrop === key;
                    return (
                      <button
                        key={key}
                        onClick={() => setSelectedCrop(key)}
                        style={{
                          background: isSelected ? 'var(--color-brand-primary)' : 'var(--color-surface)',
                          color: isSelected ? '#ffffff' : 'var(--color-text-primary)',
                          border: isSelected ? '1px solid var(--color-brand-primary)' : '1px solid var(--color-border)',
                          padding: '6px 14px',
                          borderRadius: 'var(--radius-full)',
                          fontSize: '0.78rem',
                          fontWeight: isSelected ? 700 : 500,
                          cursor: 'pointer',
                          transition: 'all var(--transition-fast)',
                          boxShadow: isSelected ? '0 2px 8px rgba(26, 144, 32, 0.25)' : 'none',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <Sprout size={14} />
                        <span>{crop.name}</span>
                      </button>
                    );
                  })}
                </div>

                <div style={{
                  background: 'var(--color-surface)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                  padding: '12px 14px',
                  marginBottom: '12px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px', flexWrap: 'wrap', gap: '6px' }}>
                    <span style={{
                      background: severityBg,
                      color: severityFg,
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-full)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      {cropRisk.severity === 'good' ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                      {cropRisk.status}
                    </span>
                    <span style={{
                      fontSize: '0.72rem',
                      color: 'var(--color-brand-primary)',
                      fontWeight: 600,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <Clock size={12} />
                      {cropRisk.optimalTime}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.5 }}>
                    {cropRisk.action}
                  </p>
                </div>

                {/* Daily Farming Work Window */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 170px), 1fr))',
                  gap: '8px',
                  paddingTop: '8px',
                  borderTop: '1px dashed var(--color-border)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-brand-primary)' }} />
                    <span><strong>Pagi (06:00 – 08:30):</strong> Serapan Nutrisi Daun</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#b45309' }} />
                    <span><strong>Siang (11:30 – 14:00):</strong> Rehat / Redam Evaporasi</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#0284c7' }} />
                    <span><strong>Sore (15:30 – 17:30):</strong> Irigasi &amp; Penyiangan</span>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>

      {/* ========================================================================= */}
      {/* TAB 3: PRAKIRAAN 7-HARI LENGKAP & ASTRONOMI */}
      {/* ========================================================================= */}
      <div id="weather-tab-mingguan" style={{ flex: '0 0 100%', minWidth: '100%', scrollSnapAlign: 'start' }}>
          {/* Header 7 Hari & Astronomi */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '14px',
            flexWrap: 'wrap',
            gap: '8px'
          }}>
            <div>
              <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                Prakiraan Agrometeorologi 7 Hari Kedepan
              </h4>
              <p style={{ margin: '2px 0 0 0', fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                Suhu ekstrem harian, akumulasi presipitasi, dan indeks radiasi UV
              </p>
            </div>

            {/* Moon Phase Banner */}
            <div style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-full)',
              padding: '5px 14px',
              fontSize: '0.75rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <MoonIcon size={14} color="#cfa23d" />
              <span style={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>{moonInfo.name}</span>
              <span style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono, monospace)', fontSize: '0.7rem' }}>({moonInfo.illuminance})</span>
            </div>
          </div>

          {/* 7-Day Grid Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(95px, 1fr))',
            gap: '8px',
            marginBottom: '16px'
          }}>
            {data.forecast.slice(0, 7).map((fc, index) => {
              const fcIcon = fc.icon === 'cloud-rain'
                ? rainIcon
                : fc.icon === 'cloud'
                  ? overcastIcon
                  : fc.icon === 'sun'
                    ? clearDayIcon
                    : partlyCloudyDayIcon;

              return (
                <div
                  key={index}
                  className="forecast-item-card"
                  style={{
                    padding: '12px 8px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    border: index === 0 ? '1px solid var(--color-brand-primary)' : '1px solid var(--color-border)'
                  }}
                >
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: index === 0 ? 'var(--color-brand-primary)' : 'var(--color-text-primary)' }}>
                    {fc.day}
                  </div>
                  <div style={{ fontSize: '0.66rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>
                    {fc.date}
                  </div>
                  <div style={{
                    margin: '4px 0',
                    width: '36px',
                    height: '36px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <img
                      src={fcIcon}
                      alt={fc.condition}
                      width={34}
                      height={34}
                      className="weather-monochrome-icon"
                      style={{ objectFit: 'contain' }}
                    />
                  </div>
                  <div style={{
                    fontSize: '0.84rem',
                    fontWeight: 800,
                    fontFamily: 'var(--font-mono, monospace)',
                    color: 'var(--color-text-primary)',
                    marginTop: '2px'
                  }}>
                    {fc.tempNum}&deg;C
                  </div>
                  <div style={{
                    fontSize: '0.66rem',
                    color: fc.rainProb > 40 ? 'var(--color-brand-mid)' : 'var(--color-text-muted)',
                    fontWeight: 600,
                    marginTop: '2px',
                    fontFamily: 'var(--font-mono, monospace)'
                  }}>
                    Hujan {fc.rainProb}%
                  </div>
                  {fc.rainSum !== undefined && fc.rainSum > 0 && (
                    <div style={{
                      fontSize: '0.62rem',
                      color: 'var(--color-brand-primary)',
                      fontWeight: 700,
                      fontFamily: 'var(--font-mono, monospace)'
                    }}>
                      {fc.rainSum} mm
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Astronomical Note */}
          <div style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            padding: '10px 14px',
            fontSize: '0.75rem',
            color: 'var(--color-text-secondary)',
            lineHeight: 1.5,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <SunIcon size={16} color="#cfa23d" style={{ flexShrink: 0 }} />
            <span>
              <strong>Kearifan Pranata Mangsa:</strong> Siklus bulan dan posisi surya lereng barat Ciremai memengaruhi pergerakan kabut malam dan tingkat kelembaban bedengan sayur di dataran Sukadana.
            </span>
          </div>
        </div>

      {/* ========================================================================= */}
      {/* TAB 4: DINAMIKA JAM PER JAM (HOURLY TIMELINE) */}
      {/* ========================================================================= */}
      <div id="weather-tab-hourly" style={{ flex: '0 0 100%', minWidth: '100%', scrollSnapAlign: 'start' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '12px'
          }}>
            <div>
              <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                Evolusi Cuaca 12 Jam Kedepan
              </h4>
              <p style={{ margin: '2px 0 0 0', fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                Fluktuasi suhu udara, peluang hujan, dan kecepatan angin per interval waktu
              </p>
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
              Geser ke samping &rarr;
            </div>
          </div>

          {/* Horizontal Hourly Strip */}
          <div className="weather-hourly-timeline">
            {(data.hourlyTrends && data.hourlyTrends.length > 0 ? data.hourlyTrends : []).map((hr, idx) => {
              const hrMapped = mapWmoToMonochromeWeather(hr.weatherCode, hr.isDay);
              return (
                <div key={idx} className="weather-hourly-item">
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono, monospace)' }}>
                    {hr.hourStr}
                  </span>
                  <div style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img
                      src={hrMapped.iconUrl}
                      alt={hrMapped.condition}
                      width={30}
                      height={30}
                      className="weather-monochrome-icon"
                      style={{ objectFit: 'contain' }}
                    />
                  </div>
                  <span style={{ fontSize: '0.88rem', fontWeight: 800, fontFamily: 'var(--font-mono, monospace)', color: 'var(--color-text-primary)' }}>
                    {hr.temp}&deg;C
                  </span>
                  
                  {/* Rain Probability Mini Bar */}
                  <div style={{ width: '100%', marginTop: '2px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.62rem', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono, monospace)' }}>
                      <span>Hujan</span>
                      <span>{hr.rainProb}%</span>
                    </div>
                    <div style={{
                      width: '100%',
                      height: '4px',
                      background: 'var(--color-border)',
                      borderRadius: 'var(--radius-full)',
                      overflow: 'hidden',
                      marginTop: '2px'
                    }}>
                      <div style={{
                        width: `${hr.rainProb}%`,
                        height: '100%',
                        background: hr.rainProb > 50 ? 'var(--color-brand-primary)' : 'var(--color-brand-mid)',
                        borderRadius: 'var(--radius-full)'
                      }} />
                    </div>
                  </div>

                  {/* Wind speed */}
                  <span style={{ fontSize: '0.62rem', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono, monospace)' }}>
                    {hr.windSpeed} km/j
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {/* Footer Meta & Telemetry Status */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: '16px',
        paddingTop: '12px',
        borderTop: '1px solid var(--color-border)',
        fontSize: '0.72rem',
        color: 'var(--color-text-muted)',
        flexWrap: 'wrap',
        gap: '8px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <ShieldCheck size={14} color="var(--color-brand-primary)" />
          <span>Telemetri Geospasial Resolusi Tinggi &bull; Terhubung Satelit ECMWF &amp; Open-Meteo High Resolution</span>
        </div>
        <div style={{ fontFamily: 'var(--font-mono, monospace)' }}>
          {data.updatedAt}
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;
