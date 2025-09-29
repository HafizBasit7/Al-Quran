import axios from 'axios';

class IslamicCalendarService {
  constructor() {
    this.baseURL = 'https://api.aladhan.com/v1';
    this.cache = new Map();
    this.cacheDuration = 4 * 60 * 60 * 1000; // 4 hours
  }

  // Simple API call without complex retry logic
  async apiCall(url) {
    try {
      const response = await axios.get(url, {
        timeout: 10000,
      });
      
      if (response.data && response.data.code === 200) {
        return response.data;
      }
      throw new Error(`API returned code: ${response.data?.code || 'unknown'}`);
      
    } catch (error) {
      console.warn('API call failed:', error.message);
      throw error;
    }
  }

  // Get current Islamic date
  async getCurrentIslamicDate() {
    try {
      const cacheKey = 'currentDate';
      const cached = this.getFromCache(cacheKey);
      if (cached) return cached;

      const today = new Date();
      const day = String(today.getDate()).padStart(2, '0');
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const year = today.getFullYear();
      const dateString = `${day}-${month}-${year}`;

      const data = await this.apiCall(`${this.baseURL}/gToH?date=${dateString}`);
      
      const hijriData = data.data.hijri;
      const islamicDate = {
        day: parseInt(hijriData.day),
        month: parseInt(hijriData.month.number),
        year: parseInt(hijriData.year),
        monthName: hijriData.month.en,
        monthNameAr: hijriData.month.ar,
        dayName: hijriData.weekday.en,
        dayNameAr: hijriData.weekday.ar,
        gregorianDate: today.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        formatted: `${hijriData.day} ${hijriData.month.en} ${hijriData.year} AH`,
        formattedAr: `${hijriData.day} ${hijriData.month.ar} ${hijriData.year} هـ`,
        timestamp: today.getTime(),
        isApiData: true
      };

      this.setToCache(cacheKey, islamicDate);
      return islamicDate;

    } catch (error) {
      console.error('Error getting Islamic date:', error);
      return this.getFallbackIslamicDate();
    }
  }

  // Get upcoming events - SIMPLIFIED VERSION
  async getUpcomingEvents() {
    try {
      const cacheKey = 'upcomingEvents';
      const cached = this.getFromCache(cacheKey);
      if (cached) return cached;

      const currentDate = new Date();
      const currentIslamicDate = await this.getCurrentIslamicDate();
      const currentHijriYear = currentIslamicDate.year;

      // console.log('Current Hijri Year:', currentHijriYear); // Debug log

      const events = [];
      
      // Define Islamic events
      const islamicEvents = [
        { name: 'Islamic New Year', month: 1, day: 1, type: 'new-year', description: 'First day of Muharram' },
        { name: 'Ashura', month: 1, day: 10, type: 'ashura', description: 'Day of Ashura' },
        { name: 'Mawlid al-Nabi', month: 3, day: 12, type: 'mawlid', description: 'Prophet Muhammad\'s birthday' },
        { name: 'Lailat al-Mi\'raj', month: 7, day: 27, type: 'miraj', description: 'Night Journey' },
        { name: 'Start of Ramadan', month: 9, day: 1, type: 'ramadan', description: 'Beginning of fasting month' },
        { name: 'Laylat al-Qadr', month: 9, day: 27, type: 'qadr', description: 'Night of Power' },
        { name: 'Eid al-Fitr', month: 10, day: 1, type: 'eid', description: 'Festival of Breaking Fast' },
        { name: 'Hajj Starts', month: 12, day: 8, type: 'hajj', description: 'Pilgrimage begins' },
        { name: 'Day of Arafah', month: 12, day: 9, type: 'arafah', description: 'Day of standing at Arafah' },
        { name: 'Eid al-Adha', month: 12, day: 10, type: 'eid', description: 'Festival of Sacrifice' }
      ];

      // Calculate events for current and next Hijri year
      for (let yearOffset = 0; yearOffset <= 1; yearOffset++) {
        const year = currentHijriYear + yearOffset;
        
        for (const event of islamicEvents) {
          try {
            const gregorianDate = await this.hijriToGregorian(event.day, event.month, year);
            
            if (gregorianDate) {
              // Reset time part for accurate date comparison
              const eventDate = new Date(gregorianDate.getFullYear(), gregorianDate.getMonth(), gregorianDate.getDate());
              const today = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
              
              const daysUntil = Math.ceil((eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
              
              // Include events from today onward
              if (daysUntil >= 0) {
                events.push({
                  ...event,
                  date: eventDate,
                  daysUntil,
                  isToday: daysUntil === 0,
                  hijriDate: `${event.day} ${this.getMonthName(event.month)} ${year} AH`,
                  hijriYear: year,
                  isApiData: true
                });
              }
            }
          } catch (error) {
            console.warn(`Failed to calculate ${event.name} ${year}:`, error.message);
            // Use approximation
            const approxDate = this.approximateHijriToGregorian(event.day, event.month, year);
            if (approxDate) {
              const eventDate = new Date(approxDate.getFullYear(), approxDate.getMonth(), approxDate.getDate());
              const today = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
              const daysUntil = Math.ceil((eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
              
              if (daysUntil >= 0) {
                events.push({
                  ...event,
                  date: eventDate,
                  daysUntil,
                  isToday: daysUntil === 0,
                  hijriDate: `${event.day} ${this.getMonthName(event.month)} ${year} AH`,
                  hijriYear: year,
                  isApiData: false,
                  isApproximate: true
                });
              }
            }
          }
        }
      }

      // Sort by date and limit to 20 events
      const sortedEvents = events
        .filter(event => event && event.date)
        .sort((a, b) => a.date - b.date)
        .slice(0, 20);

      // console.log('Calculated events:', sortedEvents.length); // Debug log
      this.setToCache(cacheKey, sortedEvents);
      return sortedEvents;

    } catch (error) {
      console.error('Error fetching Islamic events:', error);
      return this.getFallbackEvents();
    }
  }

  // Convert Hijri to Gregorian
  async hijriToGregorian(hijriDay, hijriMonth, hijriYear) {
    try {
      const day = String(hijriDay).padStart(2, '0');
      const month = String(hijriMonth).padStart(2, '0');
      const dateString = `${day}-${month}-${hijriYear}`;
      
      const data = await this.apiCall(`${this.baseURL}/hToG?date=${dateString}`);
      
      const gregorian = data.data.gregorian;
      const convertedDate = new Date(
        parseInt(gregorian.year),
        parseInt(gregorian.month) - 1,
        parseInt(gregorian.day)
      );

      if (isNaN(convertedDate.getTime())) {
        throw new Error('Invalid date from API');
      }

      return convertedDate;
      
    } catch (error) {
      console.warn('API conversion failed:', error.message);
      throw error;
    }
  }

  // Simple approximation method
  approximateHijriToGregorian(hijriDay, hijriMonth, hijriYear) {
    try {
      // Simple conversion: 1 Hijri year ≈ 354.367 days
      const hijriEpoch = new Date(622, 6, 16); // July 16, 622 CE
      const daysSinceEpoch = (hijriYear - 1) * 354.367 + 
                           (hijriMonth - 1) * 29.53 + 
                           (hijriDay - 1);
      
      const approxDate = new Date(hijriEpoch.getTime() + daysSinceEpoch * 24 * 60 * 60 * 1000);
      return approxDate;
    } catch (error) {
      console.error('Approximation failed:', error);
      // Return a date 30 days from now as fallback
      return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    }
  }

  // Get month name
  getMonthName(month) {
    const months = {
      1: 'Muharram', 2: 'Safar', 3: 'Rabi\' al-Awwal', 4: 'Rabi\' al-Thani',
      5: 'Jumada al-Awwal', 6: 'Jumada al-Thani', 7: 'Rajab', 8: 'Sha\'ban',
      9: 'Ramadan', 10: 'Shawwal', 11: 'Dhu al-Qidah', 12: 'Dhu al-Hijjah'
    };
    return months[month] || `Month ${month}`;
  }

  getMonthNameArabic(month) {
    const monthsAr = {
      1: 'محرم', 2: 'صفر', 3: 'ربيع الأول', 4: 'ربيع الثاني',
      5: 'جمادى الأولى', 6: 'جمادى الآخرة', 7: 'رجب', 8: 'شعبان',
      9: 'رمضان', 10: 'شوال', 11: 'ذو القعدة', 12: 'ذو الحجة'
    };
    return monthsAr[month] || `الشهر ${month}`;
  }

  // Cache management
  getFromCache(key) {
    const cached = this.cache.get(key);
    if (cached && (Date.now() - cached.timestamp) < this.cacheDuration) {
      return cached.data;
    }
    this.cache.delete(key);
    return null;
  }

  setToCache(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  clearCache() {
    this.cache.clear();
  }

  // Fallback methods
  getFallbackIslamicDate() {
    const today = new Date();
    const hijriYear = Math.floor(today.getFullYear() - 579.3);
    const approximateMonth = ((today.getMonth() + 1) % 12) || 12;
    
    return {
      day: today.getDate(),
      month: approximateMonth,
      year: hijriYear,
      monthName: this.getMonthName(approximateMonth),
      monthNameAr: this.getMonthNameArabic(approximateMonth),
      dayName: today.toLocaleDateString('en-US', { weekday: 'long' }),
      dayNameAr: this.getArabicDayName(today.getDay()),
      gregorianDate: today.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      formatted: `${today.getDate()} ${this.getMonthName(approximateMonth)} ${hijriYear} AH`,
      formattedAr: `${today.getDate()} ${this.getMonthNameArabic(approximateMonth)} ${hijriYear} هـ`,
      timestamp: today.getTime(),
      isApiData: false,
      isApproximate: true
    };
  }

  getArabicDayName(dayIndex) {
    const arabicDays = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    return arabicDays[dayIndex] || 'يوم';
  }

  getFallbackEvents() {
    const today = new Date();
    const currentHijriYear = Math.floor(today.getFullYear() - 579.3);
    const events = [];
    
    // Add some basic events as fallback
    const basicEvents = [
      { name: 'Start of Ramadan', month: 9, day: 1, type: 'ramadan' },
      { name: 'Eid al-Fitr', month: 10, day: 1, type: 'eid' },
      { name: 'Eid al-Adha', month: 12, day: 10, type: 'eid' }
    ];

    basicEvents.forEach(event => {
      const approxDate = this.approximateHijriToGregorian(event.day, event.month, currentHijriYear);
      if (approxDate) {
        const eventDate = new Date(approxDate.getFullYear(), approxDate.getMonth(), approxDate.getDate());
        const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const daysUntil = Math.ceil((eventDate.getTime() - todayDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysUntil >= 0) {
          events.push({
            ...event,
            date: eventDate,
            daysUntil,
            isToday: daysUntil === 0,
            hijriDate: `${event.day} ${this.getMonthName(event.month)} ${currentHijriYear} AH`,
            hijriYear: currentHijriYear,
            isApiData: false,
            isApproximate: true,
            description: event.name
          });
        }
      }
    });

    return events.sort((a, b) => a.date - b.date);
  }

  // Service status check
  async getServiceStatus() {
    try {
      await this.apiCall(`${this.baseURL}/gToH`);
    //   return { status: 'online', message: 'API service is available' };
    } catch (error) {
    //   return { status: 'offline', message: 'API service unavailable, using approximations' };
    }
  }
}

export default new IslamicCalendarService();