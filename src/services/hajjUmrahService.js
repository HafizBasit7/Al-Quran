// services/hajjUmrahService.js

class HajjUmrahService {
    constructor() {
      this.guideData = this.getEnhancedGuideData();
    }
  
    getEnhancedGuideData() {
      return {
        hajj: {
          title: "Complete Hajj Guide",
          description: "Step-by-step guidance for performing Hajj with comprehensive details and historical significance",
          duration: "5-6 Days",
        //   type: "Mandatory once in lifetime for those who are able",
          requirements: [
            "Muslim",
            "Baligh (reached puberty)",
            "Aqil (sane)",
            "Free (not a slave)",
            "Mustati (financially and physically able)"
          ],
          steps: [
            {
              id: 1,
              title: "Preparation & Ihram",
              subtitle: "Spiritual Preparation and Sacred State",
              description: "Before reaching Miqat, perform Ghusl, wear Ihram garments, and make sincere intention for Hajj. The Miqat is the boundary where Ihram must be entered. This marks the beginning of your spiritual journey.",
              arabic: "نَوَيْتُ الْحَجَّ وَأَحْرَمْتُ بِهِ لِلَّهِ تَعَالَى",
              transliteration: "Nawaytul Hajja wa ahramtu bihi lillahi ta'ala",
              translation: "I intend to perform Hajj and have entered Ihram for it for Allah the Almighty",
              image: "ihram",
              timing: "Before reaching Miqat boundary",
              importantNotes: [
                "Perform Ghusl (purificatory bath) if possible",
                "Men wear two white unstitched cloths",
                "Women wear regular modest Islamic clothing",
                "Trim nails, remove unwanted body hair",
                "Apply perfume if available before Ihram"
              ],
              prohibitedActions: [
                "Cutting hair or nails",
                "Using perfume or scented products",
                "Hunting or assisting in hunting",
                "Sexual relations or intimacy",
                "Marriage contracts or proposals"
              ],
              historicalContext: "The tradition of Ihram dates back to Prophet Ibrahim (AS) and has been preserved through all Abrahamic traditions. The simple white garments symbolize equality and purity before Allah.",
              duas: [
                {
                  arabic: "لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ، لَبَّيْكَ لاَ شَرِيكَ لَكَ لَبَّيْكَ، إِنَّ الْحَمْدَ وَالنِّعْمَةَ لَكَ وَالْمُلْكَ، لاَ شَرِيكَ لَكَ",
                  transliteration: "Labbayk Allahumma labbayk, labbayka la sharika laka labbayk, innal hamda wan ni'mata laka wal mulk, la sharika lak",
                  translation: "Here I am, O Allah, here I am. Here I am, You have no partner, here I am. Verily all praise and blessings are Yours, and all sovereignty, You have no partner."
                },
                {
                  arabic: "اللَّهُمَّ اجْعَلْهُ حَجًّا مَبْرُورًا وَسَعْيًا مَشْكُورًا وَذَنْبًا مَغْفُورًا",
                  transliteration: "Allahummaj'alhu hajjan mabrura wa sa'yan mashkura wa dhanban maghfura",
                  translation: "O Allah, make it an accepted Hajj, and a striving that is thanked, and a sin that is forgiven."
                }
              ],
              bestPractices: [
                "Practice Talbiyah frequently during journey",
                "Maintain state of purity and remembrance",
                "Help fellow pilgrims in need",
                "Keep intentions pure for Allah alone",
                "Be patient and courteous with others"
              ]
            },
            {
              id: 2,
              title: "Tawaf al-Qudum",
              subtitle: "Arrival Circumambulation",
              description: "Upon entering Masjid al-Haram, perform welcome Tawaf. Start from Black Stone, make seven circuits around Kaaba, with each circuit beginning and ending at Black Stone. This ritual symbolizes the unity of Muslims worldwide.",
              arabic: "بِسْمِ اللَّهِ وَاللَّهُ أَكْبَرُ، اللَّهُمَّ إِيمَانًا بِكَ وَتَصْدِيقًا بِكِتَابِكَ",
              transliteration: "Bismillahi wallahu akbar, allahumma imanan bika wa tasdiqan bi kitabika",
              translation: "In the name of Allah, and Allah is the Greatest. O Allah, out of faith in You and belief in Your Book.",
              image: "tawaf",
              timing: "Upon arrival in Makkah before going to accommodation",
              importantNotes: [
                "Start each circuit facing Black Stone saying 'Bismillah Allahu Akbar'",
                "Men should uncover right shoulder (Idtiba) during all circuits",
                "Walk briskly in first three circuits (Ramal)",
                "Walk normally in remaining four circuits",
                "Perform two rak'ahs at Maqam Ibrahim after completion"
              ],
              circuitDuas: [
                {
                  circuit: "All circuits",
                  arabic: "سُبْحَانَ اللَّهِ وَالْحَمْدُ لِلَّهِ وَلاَ إِلَهَ إِلاَّ اللَّهُ وَاللَّهُ أَكْبَرُ",
                  translation: "Glory be to Allah, all praise is for Allah, there is no god but Allah, and Allah is the Greatest"
                },
                {
                  circuit: "Between Yemeni Corner and Black Stone",
                  arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
                  translation: "Our Lord, give us in this world good and in the Hereafter good and protect us from the punishment of the Fire."
                }
              ],
              historicalContext: "Tawaf dates back to Prophet Ibrahim (AS) who established the ritual of circumambulating the first house of worship built for mankind. The Black Stone was sent from Heaven and placed by Prophet Ibrahim.",
              duas: [
                {
                  arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
                  transliteration: "Rabbana atina fid dunya hasanatan wa fil akhirati hasanatan wa qina 'adhaban nar",
                  translation: "Our Lord, give us in this world good and in the Hereafter good and protect us from the punishment of the Fire."
                },
                {
                  arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي الدُّنْيَا وَالآخِرَةِ",
                  transliteration: "Allahumma inni as'alukal 'afwa wal 'afiyata fid dunya wal akhirah",
                  translation: "O Allah, I ask You for pardon and well-being in this world and the next."
                }
              ]
            },
            {
              id: 3,
              title: "Sa'i Between Safa & Marwa",
              subtitle: "Commemorating Hajrah's Search for Water",
              description: "Walk seven times between Safa and Marwa hills, commemorating Hajrah's (AS) search for water for her son Ismail. This ritual symbolizes trust in Allah during difficulties and the reward for perseverance.",
              arabic: "إِنَّ الصَّفَا وَالْمَرْوَةَ مِن شَعَائِرِ اللَّهِ فَمَنْ حَجَّ الْبَيْتَ أَوِ اعْتَمَرَ فَلاَ جُنَاحَ عَلَيْهِ أَنْ يَطَّوَّفَ بِهِمَا",
              transliteration: "Innas safa wal marwata min sha'airillahi faman hajjal bayta awi'tamara fala junaha 'alayhi an yattawwafa bihima",
              translation: "Indeed, Safa and Marwa are among the symbols of Allah. So whoever makes Hajj to the House or performs Umrah - there is no blame upon him for walking between them.",
              image: "sai",
              timing: "After Tawaf al-Qudum",
              importantNotes: [
                "Start at Safa and end at Marwa (one complete round)",
                "Men should run between the green lights (only during Hajj)",
                "Make dua at top of both Safa and Marwa",
                "Complete 7 rounds total (Safa to Marwa = 1, Marwa to Safa = 2, etc.)",
                "No specific dua required between hills - make personal supplications"
              ],
              historicalContext: "This ritual commemorates Hajrah (AS), wife of Prophet Ibrahim, who ran between these hills seven times searching for water for her infant son Ismail. Her unwavering faith was rewarded with the miracle of Zamzam spring, which continues to flow today.",
              bestPractices: [
                "Remember Hajrah's story during the ritual",
                "Make sincere personal supplications",
                "Help elderly or disabled pilgrims",
                "Stay hydrated during the walk",
                "Maintain spiritual focus throughout"
              ],
              duas: [
                {
                  arabic: "أَبْدَأُ بِمَا بَدَأَ اللَّهُ بِهِ",
                  transliteration: "Abda'u bima bad'allahu bihi",
                  translation: "I begin with what Allah began with."
                },
                {
                  arabic: "اللَّهُمَّ اغْفِرْ وَارْحَمْ وَاعْفُ وَتَكَرَّمْ وَتَجَاوَزْ عَمَّا تَعْلَمْ إِنَّكَ تَعْلَمُ مَا لاَ نَعْلَمُ إِنَّكَ أَنْتَ اللَّهُ الأَكْرَمُ",
                  transliteration: "Allahummaghfir warham wa'fu wa takarram wa tajawaz 'amma ta'lam, innaka ta'lamu ma la na'lam, innaka antallahu al-akram",
                  translation: "O Allah, forgive and have mercy, and pardon and be generous, and overlook what You know. Indeed, You know what we do not know. Indeed, You are Allah, the Most Generous."
                },
                {
                  arabic: "رَبِّ اغْفِرْ وَارْحَمْ إِنَّكَ أَنْتَ الأَعَزُّ الأَكْرَمُ",
                  transliteration: "Rabbighfir warham innaka antal a'azzul akram",
                  translation: "My Lord, forgive and have mercy, indeed You are the Most Mighty, the Most Generous."
                }
              ]
            },
            {
              id: 4,
              title: "Day of Arafah",
              subtitle: "The Essence of Hajj",
              description: "Spend the day at Arafat from noon until sunset in worship, supplication, and seeking forgiveness. This is the most important day of Hajj - the day of forgiveness, mercy, and acceptance of prayers. Standing at Arafat IS Hajj.",
              arabic: "لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
              transliteration: "La ilaha illallahu wahdahu la sharika lah, lahul mulku wa lahul hamdu, wa huwa 'ala kulli shay'in qadeer",
              translation: "There is no deity worthy of worship except Allah alone, without partner. To Him belongs all sovereignty and praise, and He is over all things competent.",
              image: "arafah",
              timing: "9th of Dhul Hijjah from noon until sunset",
              importantNotes: [
                "Most important day of Hajj - standing at Arafat IS Hajj",
                "Combine and shorten Dhuhr and Asr prayers at noon time",
                "Spend time in sincere dua, dhikr, and seeking forgiveness",
                "Face Qibla and raise hands in supplication",
                "Stay within boundaries of Arafat - do not leave before sunset"
              ],
              historicalContext: "Arafat is where Prophet Muhammad (PBUH) delivered his farewell sermon to 140,000 companions. It is also believed to be where Adam and Eve reunited after descending from Paradise. The Day of Arafah is when Allah perfected the religion of Islam.",
              bestPractices: [
                "Arrive early to find good spot for worship",
                "Make sincere repentance for all sins",
                "Recite Quran and make abundant dhikr",
                "Pray for yourself, family, and all Muslims worldwide",
                "Stay hydrated and help fellow pilgrims"
              ],
              duas: [
                {
                  arabic: "اللَّهُمَّ لَكَ الْحَمْدُ كَالَّذِي تَقُولُ، وَخَيْرًا مِمَّا نَقُولُ، اللَّهُمَّ لَكَ صَلَّاتِي وَنُسُكِي وَمَحْيَايَ وَمَمَاتِي، وَإِلَيْكَ مَآبِي، وَأَنْتَ رَبِّي، اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ عَذَابِ الْقَبْرِ، وَوَسْوَسَةِ الصَّدْرِ، وَشَتَّاتِ الأَمْرِ",
                  transliteration: "Allahumma lakal hamdu kalladhi taqulu, wa khairan mimma naqulu, allahumma laka salati wa nusuki wa mahyaya wa mamati, wa ilayka maabi, wa anta rabbi, allahumma inni a'udhu bika min 'adhabil qabri, wa waswasatis sadri, wa shattatil amri",
                  translation: "O Allah, to You is praise like what we say, and better than what we say. O Allah, to You is my prayer, my sacrifice, my life, and my death. To You is my return, and You are my Lord. O Allah, I seek refuge in You from the punishment of the grave, the whispers of the chest, and the dispersion of affairs."
                },
                {
                  arabic: "اللَّهُمَّ إِنِّي ظَلَمْتُ نَفْسِي ظُلْمًا كَثِيرًا وَلاَ يَغْفِرُ الذُّنُوبَ إِلاَّ أَنْتَ فَاغْفِرْ لِي مَغْفِرَةً مِنْ عِنْدِكَ وَارْحَمْنِي إِنَّكَ أَنْتَ الْغَفُورُ الرَّحِيمُ",
                  transliteration: "Allahumma inni zalamtu nafsi zulman kathiran wa la yaghfirudh dhunuba illa anta, faghfir li maghfiratan min 'indika warhamni, innaka antal ghafurur rahim",
                  translation: "O Allah, I have greatly wronged myself and none forgives sins except You, so grant me forgiveness from You and have mercy upon me. Indeed, You are the Forgiving, the Merciful."
                }
              ]
            },
            {
              id: 5,
              title: "Muzdalifah & Pebble Collection",
              subtitle: "Night Under Stars",
              description: "After sunset, proceed to Muzdalifah. Spend the night under open sky, combine Maghrib and Isha prayers, and collect 49-70 pebbles for stoning ritual. This night symbolizes humility and dependence on Allah.",
              arabic: "سُبْحَانَ اللَّهِ وَالْحَمْدُ لِلَّهِ وَلاَ إِلَهَ إِلاَّ اللَّهُ وَاللَّهُ أَكْبَرُ",
              transliteration: "Subhanallahi wal hamdulillahi wa la ilaha illallahu wallahu akbar",
              translation: "Glory be to Allah, and praise be to Allah, and there is no deity worthy of worship except Allah, and Allah is the Greatest",
              image: "muzdalifah",
              timing: "Night of 9th Dhul Hijjah after sunset until Fajr",
              importantNotes: [
                "Combine Maghrib and Isha prayers at Isha time",
                "Collect 49 pebbles minimum (7 for each of 7 days recommended)",
                "Pebbles should be small (size of chickpeas)",
                "Spend night in worship and rest",
                "Women and elderly can leave after midnight"
              ],
              historicalContext: "Muzdalifah is where pilgrims gather under the open sky, following the tradition of Prophet Muhammad (PBUH). The collection of pebbles symbolizes preparation for the upcoming ritual of rejecting Satan's temptations.",
              recommendedActivities: [
                "Perform prayers and make dhikr",
                "Rest and prepare for next day's activities",
                "Collect pebbles from clean areas",
                "Help fellow pilgrims find accommodation",
                "Make sincere dua during blessed night"
              ],
              duas: [
                {
                  arabic: "اللَّهُمَّ اجْعَلْ فِي قَلْبِي نُورًا، وَفِي لِسَانِي نُورًا، وَاجْعَلْ فِي سَمْعِي نُورًا، وَاجْعَلْ فِي بَصَرِي نُورًا، وَاجْعَلْ مِنْ خَلْفِي نُورًا، وَمِنْ أَمَامِي نُورًا، وَاجْعَلْ مِنْ فَوْقِي نُورًا، وَمِنْ تَحْتِي نُورًا، اللَّهُمَّ أَعْطِنِي نُورًا",
                  transliteration: "Allahummaj'al fi qalbi nura, wa fi lisani nura, waj'al fi sam'i nura, waj'al fi basari nura, waj'al min khalfi nura, wa min amami nura, waj'al min fawqi nura, wa min tahti nura, allahumma a'tini nura",
                  translation: "O Allah, place light in my heart, light in my tongue, light in my hearing, light in my seeing, light behind me, light in front of me, light above me, light below me. O Allah, grant me light."
                },
                {
                  arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ رِضَاكَ وَالْجَنَّةَ، وَأَعُوذُ بِكَ مِنْ سَخَطِكَ وَالنَّارِ",
                  transliteration: "Allahumma inni as'aluka ridaka wal jannata, wa a'udhu bika min sakhatika wan nari",
                  translation: "O Allah, I ask You for Your pleasure and Paradise, and I seek refuge in You from Your anger and the Fire."
                }
              ]
            },
            {
              id: 6,
              title: "Stoning & Sacrifice",
              subtitle: "Rami al-Jamarat & Nahr",
              description: "Throw pebbles at Jamarat pillars, offer animal sacrifice, and shave or trim hair. These actions commemorate Prophet Ibrahim's rejection of Satan and willingness to sacrifice Ismail for Allah's command.",
              arabic: "بِسْمِ اللَّهِ وَاللَّهُ أَكْبَرُ رَغْمًا لِلشَّيْطَانِ وَحِزْبِهِ وَحِسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ",
              transliteration: "Bismillahi wallahu akbar, raghman lishshaytani wa hizbih, wa hasbunallahu wa ni'mal wakeel",
              translation: "In the name of Allah, and Allah is the Greatest, in defiance of Satan and his party, and sufficient for us is Allah, and He is the best Disposer of affairs.",
              image: "jamarat",
              timing: "10th Dhul Hijjah (and 11th-13th for remaining days)",
              importantNotes: [
                "Throw 7 pebbles at each Jamrah saying Takbir each time",
                "Only large Jamrah on 10th, all three on following days",
                "Sacrifice animal or purchase sacrifice voucher",
                "Men shave head completely (preferred) or trim",
                "Women trim fingertip length of hair"
              ],
              historicalContext: "This ritual commemorates Prophet Ibrahim's rejection of Satan's temptations when commanded to sacrifice his son Ismail. The stoning symbolizes rejection of evil, while sacrifice demonstrates ultimate obedience to Allah. Allah replaced Ismail with a ram, establishing the tradition of sacrifice.",
              completionBenefits: [
                "Most Ihram restrictions are lifted",
                "Can wear regular clothes",
                "Can use perfume and scented products",
                "All prohibitions lifted except marital relations",
                "Spiritual renewal and forgiveness"
              ],
              duas: [
                {
                  arabic: "اللَّهُمَّ اجْعَلْهُ حَجًّا مَبْرُورًا وَسَعْيًا مَشْكُورًا وَذَنْبًا مَغْفُورًا",
                  transliteration: "Allahummaj'alhu hajjan mabrura wa sa'yan mashkura wa dhanban maghfura",
                  translation: "O Allah, make it an accepted Hajj, and a striving that is thanked, and a sin that is forgiven."
                },
                {
                  arabic: "اللَّهُمَّ تَقَبَّلْ مِنِّي كَمَا تَقَبَّلْتَ مِنْ عَبْدِكَ وَحَبِيبِكَ إِبْرَاهِيمَ عَلَيْهِ السَّلاَمُ",
                  transliteration: "Allahumma taqabbal minni kama taqabbalta min 'abdika wa habibika Ibrahim 'alayhis salam",
                  translation: "O Allah, accept from me as You accepted from Your servant and beloved Ibrahim, peace be upon him."
                }
              ]
            },
            {
              id: 7,
              title: "Tawaf al-Ifadah & Final Sa'i",
              subtitle: "Essential Pillars Completion",
              description: "Perform Tawaf al-Ifadah (essential pillar) and Sa'i for Hajj. After this, all restrictions are lifted except marital relations until Tawaf al-Wida. This completes the essential rites of Hajj.",
              arabic: "سُبْحَانَ اللَّهِ وَالْحَمْدُ لِلَّهِ وَلاَ إِلَهَ إِلاَّ اللَّهُ وَاللَّهُ أَكْبَرُ، لاَ حَوْلَ وَلاَ قُوَّةَ إِلاَّ بِاللَّهِ",
              transliteration: "Subhanallahi wal hamdulillahi wa la ilaha illallahu wallahu akbar, la hawla wa la quwwata illa billah",
              translation: "Glory be to Allah, and praise be to Allah, and there is no deity worthy of worship except Allah, and Allah is the Greatest. There is no power nor might except with Allah.",
              image: "tawaf",
              timing: "10th Dhul Hijjah after stoning and haircut",
              importantNotes: [
                "Essential pillar of Hajj - must be performed",
                "Same procedure as Tawaf al-Qudum but no Ramal or Idtiba",
                "Perform Sa'i for Hajj after Tawaf",
                "All Ihram restrictions now lifted except marital relations",
                "Can wear regular clothes and use perfume"
              ],
              completionBenefits: [
                "Hajj essential pillars completed",
                "All restrictions lifted except marital relations",
                "Can resume normal activities",
                "Return to Mina for remaining days",
                "Spiritual transformation achieved"
              ],
              duas: [
                {
                  arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ رِضَاكَ وَالْجَنَّةَ، وَأَعُوذُ بِكَ مِنْ سَخَطِكَ وَالنَّارِ",
                  transliteration: "Allahumma inni as'aluka ridaka wal jannata, wa a'udhu bika min sakhatika wan nari",
                  translation: "O Allah, I ask You for Your pleasure and Paradise, and I seek refuge in You from Your anger and the Fire."
                },
                {
                  arabic: "اللَّهُمَّ تَقَبَّلْ مِنِّي وَاغْفِرْ لِي وَارْحَمْنِي وَأَعُوذُ بِكَ مِنْ عَذَابِ الْقَبْرِ وَعَذَابِ النَّارِ",
                  transliteration: "Allahumma taqabbal minni waghfir li warhamni wa a'udhu bika min 'adhabil qabri wa 'adhabin nar",
                  translation: "O Allah, accept from me, forgive me, have mercy on me, and I seek refuge in You from the punishment of the grave and the punishment of the Fire."
                }
              ]
            },
            {
              id: 8,
              title: "Tawaf al-Wida & Departure",
              subtitle: "Farewell Circumambulation",
              description: "Perform farewell Tawaf before leaving Makkah. This is the final ritual of Hajj before returning home with renewed faith, forgiveness, and spiritual transformation.",
              arabic: "الْحَمْدُ لِلَّهِ الَّذِي بِنِعْمَتِهِ تَتِمُّ الصَّالِحَاتُ",
              transliteration: "Alhamdulillahil ladhi bi ni'matihi tatimmus salihat",
              translation: "All praise is for Allah by Whose favor good deeds are completed",
              image: "tawaf",
              timing: "Before leaving Makkah for final departure",
              importantNotes: [
                "Last ritual before leaving Makkah",
                "Not required for women menstruating or bleeding after childbirth",
                "Same as other Tawaf but with farewell intention",
                "Make sincere dua for acceptance",
                "Depart with heavy heart and hope to return"
              ],
              historicalContext: "The farewell Tawaf symbolizes the completion of Hajj rites and the pilgrim's departure from the House of Allah. It's a moment of gratitude and reflection on the spiritual journey undertaken.",
              farewellDuas: [
                {
                  arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ مُوجِبَاتِ رَحْمَتِكَ وَعَزَائِمَ مَغْفِرَتِكَ وَالسَّلاَمَةَ مِنْ كُلِّ إِثْمٍ وَالْغَنِيمَةَ مِنْ كُلِّ بِرٍّ وَالْفَوْزَ بِالْجَنَّةِ وَالنَّجَاةَ مِنَ النَّارِ",
                  transliteration: "Allahumma inni as'aluka mujibati rahmatika wa 'aza'ima maghfiratika wassalamata min kulli ithmin wal ghanimata min kulli birrin wal fawza bil jannati wan najata minan nar",
                  translation: "O Allah, I ask You for the causes of Your mercy, the certainties of Your forgiveness, safety from every sin, the benefit of every good, success in attaining Paradise, and salvation from the Fire."
                }
              ],
              duas: [
                {
                  arabic: "اللَّهُمَّ اجْعَلْنِي مِنَ الْعَائِدِينَ وَلاَ تَجْعَلْنِي مِنَ الْعَائِدِينَ",
                  transliteration: "Allahummaj'alni minal 'aidina wa la taj'alni minal 'aidina",
                  translation: "O Allah, make me among those who return (to Your House) and do not make me among those who are prevented."
                },
                {
                  arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ حُبَّكَ وَحُبَّ مَنْ يُحِبُّكَ وَحُبَّ عَمَلٍ يُقَرِّبُنِي إِلَى حُبِّكَ",
                  transliteration: "Allahumma inni as'aluka hubbaka wa hubba man yuhibbuka wa hubba 'amalin yuqarribuni ila hubbika",
                  translation: "O Allah, I ask You for Your love, and the love of those who love You, and the love of every action that will bring me closer to Your love."
                }
              ]
            }
          ]
        },
        umrah: {
          title: "Complete Umrah Guide",
          description: "Step-by-step guidance for performing Umrah - the lesser pilgrimage that can be performed anytime throughout the year",
          duration: "2-3 Hours",
        //   type: "Voluntary pilgrimage that can be performed anytime",
          requirements: [
            "Muslim",
            "Baligh (reached puberty)",
            "Aqil (sane)"
          ],
          steps: [
            {
              id: 1,
              title: "Ihram at Miqat",
              subtitle: "Entering Sacred State",
              description: "At designated Miqat points, purify yourself, wear Ihram garments, and make intention for Umrah. Miqat boundaries vary based on direction of travel to Makkah.",
              arabic: "لَبَّيْكَ اللَّهُمَّ عُمْرَةً",
              transliteration: "Labbayk Allahumma 'umratan",
              translation: "Here I am, O Allah, for Umrah",
              image: "ihram",
              timing: "At Miqat boundary before crossing",
              importantNotes: [
                "Perform Ghusl and wear Ihram before reaching Miqat",
                "Make intention for Umrah only",
                "Recite Talbiyah frequently",
                "Avoid all prohibited actions of Ihram"
              ],
              miqatLocations: [
                "Dhul Hulayfah - for those from Madinah direction",
                "Al-Juhfah - for those from Syria/Egypt direction",
                "Qarn al-Manazil - for those from Najd direction",
                "Yalamlam - for those from Yemen direction",
                "Dhat 'Irq - for those from Iraq direction"
              ],
              historicalContext: "The Miqat boundaries were established by Prophet Muhammad (PBUH) to designate where pilgrims must enter Ihram. These boundaries ensure pilgrims enter the sacred state before approaching Makkah.",
              duas: [
                {
                  arabic: "اللَّهُمَّ هَذِهِ عُمْرَةٌ لاَ رِيَاءَ فِيهَا وَلاَ سُمْعَةَ",
                  transliteration: "Allahumma hadhihi 'umratun la riya'a fiha wa la sum'ah",
                  translation: "O Allah, this is an Umrah in which there is no showing off nor seeking reputation."
                },
                {
                  arabic: "اللَّهُمَّ إِنِّي أُرِيدُ الْعُمْرَةَ فَيَسِّرْهَا لِي وَتَقَبَّلْهَا مِنِّي",
                  transliteration: "Allahumma inni uridul 'umrata fa yassirha li wa taqabbalha minni",
                  translation: "O Allah, I intend to perform Umrah, so make it easy for me and accept it from me."
                }
              ]
            },
            {
              id: 2,
              title: "Tawaf around Kaaba",
              subtitle: "Seven Circuits of Kaaba",
              description: "Upon entering Masjid al-Haram, perform seven circuits around Kaaba starting from Black Stone. Each circuit begins and ends at Black Stone, symbolizing unity and devotion.",
              arabic: "بِسْمِ اللَّهِ وَاللَّهُ أَكْبَرُ، اللَّهُمَّ إِيمَانًا بِكَ وَتَصْدِيقًا بِكِتَابِكَ وَوَفَاءً بِعَهْدِكَ وَاتِّبَاعًا لِسُنَّةِ نَبِيِّكَ مُحَمَّدٍ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ",
              transliteration: "Bismillahi wallahu akbar, allahumma imanan bika wa tasdiqan bi kitabika wa wafa'an bi 'ahdika wattiba'an li sunnati nabiyyika Muhammadin sallallahu 'alayhi wa sallam",
              translation: "In the name of Allah, and Allah is the Greatest. O Allah, out of faith in You, belief in Your Book, fulfillment of Your covenant, and following the tradition of Your Prophet Muhammad, peace be upon him.",
              image: "tawaf",
              timing: "Upon entering Masjid al-Haram",
              importantNotes: [
                "Start each circuit facing Black Stone with Takbir",
                "Men uncover right shoulder (Idtiba) during all circuits",
                "Men walk briskly in first three circuits (Ramal)",
                "Perform two rak'ahs at Maqam Ibrahim after completion",
                "Drink Zamzam water after Tawaf"
              ],
              circuitDuas: [
                {
                  circuit: "All circuits",
                  arabic: "سُبْحَانَ اللَّهِ وَالْحَمْدُ لِلَّهِ وَلاَ إِلَهَ إِلاَّ اللَّهُ وَاللَّهُ أَكْبَرُ",
                  translation: "Glory be to Allah, all praise is for Allah, there is no god but Allah, and Allah is the Greatest"
                },
                {
                  circuit: "Between Yemeni Corner and Black Stone",
                  arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
                  translation: "Our Lord, give us in this world good and in the Hereafter good and protect us from the punishment of the Fire."
                }
              ],
              completionBenefits: [
                "Essential pillar of Umrah completed",
                "Spiritual connection with Kaaba established",
                "Can proceed to Sa'i ritual",
                "Drink blessed Zamzam water"
              ],
              duas: [
                {
                  arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي الدُّنْيَا وَالآخِرَةِ",
                  transliteration: "Allahumma inni as'alukal 'afwa wal 'afiyata fid dunya wal akhirah",
                  translation: "O Allah, I ask You for pardon and well-being in this world and the next."
                }
              ]
            },
            {
              id: 3,
              title: "Sa'i Between Safa & Marwa",
              subtitle: "Seven Walks Between Hills",
              description: "Walk seven times between Safa and Marwa hills, commemorating Hajrah's search for water. This ritual symbolizes trust in Allah during difficulties and the reward for perseverance in faith.",
              arabic: "إِنَّ الصَّفَا وَالْمَرْوَةَ مِن شَعَائِرِ اللَّهِ",
              transliteration: "Innas safa wal marwata min sha'airillah",
              translation: "Indeed, Safa and Marwa are among the signs of Allah",
              image: "sai",
              timing: "After completing Tawaf",
              importantNotes: [
                "Start at Safa, end at Marwa (one round)",
                "Men run between green markers",
                "Make dua at top of both hills",
                "Complete 7 rounds total",
                "No specific duas required between hills"
              ],
              historicalContext: "This commemorates Hajrah (AS) who ran between these hills seven times searching for water for her son Ismail. Her unwavering faith was rewarded with the miracle of Zamzam spring, which continues to bless millions today.",
              bestPractices: [
                "Remember Hajrah's struggle and faith",
                "Make personal supplications during walk",
                "Help those who need assistance",
                "Stay focused on spiritual significance",
                "Thank Allah for the blessing of water"
              ],
              duas: [
                {
                  arabic: "لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ، أَنْجَزَ وَعْدَهُ وَنَصَرَ عَبْدَهُ وَهَزَمَ الأَحْزَابَ وَحْدَهُ",
                  transliteration: "La ilaha illallahu wahdahu la sharika lah, lahul mulku wa lahul hamdu wa huwa 'ala kulli shay'in qadeer, la ilaha illallahu wahdahu, anjaza wa'dahu wa nasara 'abdahu wa hazamal ahzaba wahdahu",
                  translation: "There is no deity worthy of worship except Allah alone, without partner. To Him belongs all sovereignty and praise, and He is over all things competent. There is no deity worthy of worship except Allah alone. He fulfilled His promise, supported His servant, and defeated the confederates alone."
                }
              ]
            },
            {
              id: 4,
              title: "Halq or Taqsir",
              subtitle: "Shaving or Trimming Hair",
              description: "Complete Umrah by cutting hair. Men preferably shave head completely, while women trim fingertip length. All Ihram restrictions are now lifted, completing the Umrah rites.",
              arabic: "الْحَمْدُ لِلَّهِ الَّذِي بِنِعْمَتِهِ تَتِمُّ الصَّالِحَاتُ",
              transliteration: "Alhamdulillahil ladhi bi ni'matihi tatimmus salihat",
              translation: "All praise is for Allah by Whose favor good deeds are completed",
              image: "haircut",
              timing: "After completing Sa'i",
              importantNotes: [
                "Men shave head completely (preferred) or trim",
                "Women trim fingertip length of hair",
                "All Ihram restrictions now lifted",
                "Umrah is now completed",
                "Can wear regular clothes and resume normal activities"
              ],
              completionBenefits: [
                "Umrah successfully completed",
                "All Ihram restrictions lifted",
                "Spiritual rewards attained",
                "Can perform another Umrah if desired",
                "Return to normal daily activities"
              ],
              completionDuas: [
                {
                  arabic: "اللَّهُمَّ تَقَبَّلْ مِنِّي وَاغْفِرْ لِي ذُنُوبِي وَاجْعَلْهَا عُمْرَةً مَغْفُورًا لِي",
                  transliteration: "Allahumma taqabbal minni waghfir li dhunobi waj'alha 'umratan maghfural li",
                  translation: "O Allah, accept from me, forgive my sins, and make it an Umrah that is forgiven for me."
                },
                {
                  arabic: "اللَّهُمَّ اجْعَلْنِي مِنَ التَّوَّابِينَ وَاجْعَلْنِي مِنَ الْمُتَطَهِّرِينَ",
                  transliteration: "Allahummaj'alni minat tawwabina waj'alni minal mutatahhirin",
                  translation: "O Allah, make me among those who repent and make me among those who purify themselves."
                }
              ],
              duas: [
                {
                  arabic: "اللَّهُمَّ أَنْتَ السَّلاَمُ وَمِنْكَ السَّلاَمُ تَبَارَكْتَ يَا ذَا الْجَلاَلِ وَالإِكْرَامِ",
                  transliteration: "Allahumma antas salam wa minkas salam, tabarakta ya dhal jalali wal ikram",
                  translation: "O Allah, You are Peace and from You is peace. Blessed are You, O Possessor of majesty and honor."
                }
              ]
            }
          ]
        },
        importantPlaces: [
          {
            id: 1,
            name: "The Holy Kaaba",
            arabicName: "الكعبة المشرفة",
            description: "The House of Allah, first house of worship built for mankind. The focal point for Muslim prayer worldwide and the spiritual center of Islam. Covered with black silk Kiswa embroidered with gold Quranic verses.",
            historicalSignificance: "Originally built by Prophet Adam (AS), rebuilt by Prophet Ibrahim and Ismail (AS) approximately 4000 years ago. The Black Stone was sent from Heaven. The Kaaba has been reconstructed several times throughout history, most recently in 1996. It has survived floods, fires, and attacks throughout history.",
            spiritualSignificance: "Direction for daily prayers (Qibla), circumambulation during Hajj and Umrah, represents unity of Muslims worldwide. Every prayer directed here connects 1.8 billion Muslims in spiritual unity.",
            image: "kaaba",
            location: "Center of Masjid al-Haram, Makkah, Saudi Arabia",
            coordinates: "21.4225° N, 39.8262° E",
            specialFeatures: [
              "Black Stone (Hajar al-Aswad) in eastern corner",
              "Yemeni Corner (Ar-Rukn al-Yamani)",
              "Ibrahim's Station (Maqam Ibrahim) with his footprints",
              "Zamzam well nearby providing blessed water",
              "Kiswa - black cloth covering changed annually",
              "Multazam - area between Black Stone and door for special supplications"
            ],
            recommendedActivities: [
              "Perform Tawaf (circumambulation) around Kaaba",
              "Pray two rak'ahs at Maqam Ibrahim after Tawaf",
              "Touch or salute the Black Stone (Hajar al-Aswad) if possible",
              "Drink Zamzam water and make sincere dua",
              "Make dua at Multazam (between Black Stone and Kaaba door)",
              "Observe the Kaaba from different angles and reflect"
            ],
            visitingTips: [
              "Visit during less crowded times (early morning, late night)",
              "Maintain respect and humility throughout visit",
              "Avoid pushing or rushing during Tawaf",
              "Make sincere personal supplications",
              "Remember you are in the House of Allah",
              "Take time to absorb the spiritual atmosphere"
            ],
            duas: [
              {
                arabic: "اللَّهُمَّ زِدْ هَذَا الْبَيْتَ تَشْرِيفًا وَتَعْظِيمًا وَتَكْرِيمًا وَمَهَابَةً، وَزِدْ مَنْ شَرَّفَهُ وَكَرَّمَهُ مِمَّنْ حَجَّهُ أَوِ اعْتَمَرَهُ تَشْرِيفًا وَتَكْرِيمًا وَتَعْظِيمًا وَبِرًّا",
                transliteration: "Allahumma zid hadhal bayta tashrifan wa ta'ziman wa takriman wa mahabatan, wa zid man sharrafahu wa karramahu mimman hajjahu awi'tamarahu tashrifan wa takriman wa ta'ziman wa birran",
                translation: "O Allah, increase this House in honor, majesty, nobility and splendor. And increase those who honor it and hold it in esteem, those who perform Hajj and Umrah to it, in honor, nobility, majesty and piety."
              },
              {
                arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ أَنْ تَرْزُقَنِي الْحَجَّ وَالْعُمْرَةَ",
                transliteration: "Allahumma inni as'aluka an tarzuqanil hajja wal 'umrata",
                translation: "O Allah, I ask You to provide me with the means to perform Hajj and Umrah."
              },
              {
                arabic: "سُبْحَانَ اللَّهِ وَالْحَمْدُ لِلَّهِ وَلاَ إِلَهَ إِلاَّ اللَّهُ وَاللَّهُ أَكْبَرُ",
                transliteration: "Subhanallahi wal hamdulillahi wa la ilaha illallahu wallahu akbar",
                translation: "Glory be to Allah, all praise is for Allah, there is no god but Allah, and Allah is the Greatest."
              }
            ]
          },
          {
            id: 2,
            name: "Masjid al-Haram",
            arabicName: "المسجد الحرام",
            description: "The Sacred Mosque surrounding the Kaaba, largest mosque in the world with capacity for over 4 million worshippers. Continuously expanded throughout Islamic history with latest expansion completed in 2020.",
            historicalSignificance: "First mosque established for mankind. Site where Prophet Muhammad (PBUH) received many revelations. Expanded by various caliphs and Saudi kings throughout history. Current expansion includes advanced engineering marvels while preserving historical elements.",
            spiritualSignificance: "Prayer here equals 100,000 prayers elsewhere. Center of Islamic world and annual Hajj pilgrimage. Every prayer offered here brings immense spiritual rewards.",
            image: "masjid_haram",
            location: "Makkah, Saudi Arabia",
            coordinates: "21.4225° N, 39.8261° E",
            specialFeatures: [
              "Kaaba at center - spiritual focal point",
              "Black Stone (Hajar al-Aswad) - celestial stone",
              "Maqam Ibrahim - station of Prophet Ibrahim",
              "Zamzam well area - blessed water source",
              "Safa and Marwa hills within mosque complex",
              "Massive retractable umbrellas for shade",
              "Advanced cooling and ventilation systems",
              "Multiple levels and expansive prayer areas"
            ],
            recommendedActivities: [
              "Perform all five daily prayers in congregation",
              "Recite Quran in the mosque - great rewards",
              "Make abundant dua and dhikr throughout stay",
              "Visit at different times to experience various atmospheres",
              "Learn about the mosque's history and architecture",
              "Observe the diversity of Muslims from worldwide"
            ],
            visitingTips: [
              "Perform wudu before entering - maintain purity",
              "Dress modestly and appropriately - respect the sanctity",
              "Arrive early for prayers to get good spot",
              "Be mindful of other worshippers - practice patience",
              "Take time to appreciate the spiritual atmosphere",
              "Follow designated areas for men and women"
            ],
            duas: [
              {
                arabic: "اللَّهُمَّ إِنَّكَ عَفُوٌّ كَرِيمٌ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي",
                transliteration: "Allahumma innaka 'afuwwun karimun tuhibbul 'afwa fa'fu 'anni",
                translation: "O Allah, You are Pardoning and Generous, and You love to pardon, so pardon me."
              },
              {
                arabic: "اللَّهُمَّ اجْعَلْ فِي قَلْبِي نُورًا وَفِي لِسَانِي نُورًا وَفِي بَصَرِي نُورًا وَفِي سَمْعِي نُورًا وَمِنْ فَوْقِي نُورًا وَمِنْ تَحْتِي نُورًا وَعَنْ يَمِينِي نُورًا وَعَنْ شِمَالِي نُورًا وَمِنْ بَيْنِ يَدَيَّ نُورًا وَمِنْ خَلْفِي نُورًا وَاجْعَلْ فِي نَفْسِي نُورًا وَأَعْظِمْ لِي نُورًا",
                transliteration: "Allahummaj'al fi qalbi nura, wa fi lisani nura, wa fi basari nura, wa fi sam'i nura, wa min fawqi nura, wa min tahti nura, wa 'an yamini nura, wa 'an shimali nura, wa min bayni yadayya nura, wa min khalfi nura, waj'al fi nafsi nura, wa a'zim li nura",
                translation: "O Allah, place light in my heart, light on my tongue, light in my sight, light in my hearing, light above me, light below me, light to my right, light to my left, light in front of me, light behind me, and place light in myself, and magnify light for me."
              }
            ]
          },
          {
            id: 3,
            name: "Safa and Marwa",
            arabicName: "الصفا والمروة",
            description: "The two small hills located within Masjid al-Haram between which pilgrims perform Sa'i (walking/running) during Hajj and Umrah. Now completely enclosed within the mosque complex with modern facilities.",
            historicalSignificance: "Site where Hajrah (AS), wife of Prophet Ibrahim, ran seven times searching for water for her infant son Ismail. Her faith was rewarded with the miracle of Zamzam spring. This story is mentioned in the Quran as an example of trust in Allah.",
            spiritualSignificance: "Symbol of trust in Allah during difficulties. Part of Hajj and Umrah rituals mentioned in Quran. Demonstrates that perseverance in faith brings divine help.",
            image: "safa_marwa",
            location: "Within Masjid al-Haram, between the hills",
            coordinates: "21.4226° N, 39.8265° E",
            specialFeatures: [
              "Completely enclosed within mosque complex",
              "Air-conditioned walking area for comfort",
              "Green lights marking running area for men",
              "Multiple floors to accommodate millions of pilgrims",
              "Connected to Zamzam water distribution areas",
              "Historical markers explaining the significance",
              "Accessible routes for elderly and disabled"
            ],
            recommendedActivities: [
              "Perform Sa'i between the hills during Umrah or Hajj",
              "Remember the story of Hajrah (AS) and her trust in Allah",
              "Make dua at the top of both Safa and Marwa",
              "Reflect on the miracle of Zamzam and divine providence",
              "Drink Zamzam water after completion of Sa'i",
              "Observe the architectural marvel of the enclosed area"
            ],
            visitingTips: [
              "Start Sa'i at Safa and end at Marwa - follow proper sequence",
              "Men should run between green markers - following Sunnah",
              "Make specific duas at top of each hill - special moments",
              "Stay hydrated during the ritual - use water stations",
              "Be patient and considerate of others - crowded conditions",
              "Follow directional signs and flow of pilgrims"
            ],
            duas: [
              {
                arabic: "إِنَّ الصَّفَا وَالْمَرْوَةَ مِن شَعَائِرِ اللَّهِ فَمَنْ حَجَّ الْبَيْتَ أَوِ اعْتَمَرَ فَلاَ جُنَاحَ عَلَيْهِ أَنْ يَطَّوَّفَ بِهِمَا",
                transliteration: "Innas safa wal marwata min sha'airillahi faman hajjal bayta awi'tamara fala junaha 'alayhi an yattawwafa bihima",
                translation: "Indeed, Safa and Marwa are among the symbols of Allah. So whoever makes Hajj to the House or performs Umrah - there is no blame upon him for walking between them."
              },
              {
                arabic: "أَبْدَأُ بِمَا بَدَأَ اللَّهُ بِهِ",
                transliteration: "Abda'u bima bad'allahu bihi",
                translation: "I begin with what Allah began with."
              },
              {
                arabic: "لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ، أَنْجَزَ وَعْدَهُ وَنَصَرَ عَبْدَهُ وَهَزَمَ الأَحْزَابَ وَحْدَهُ",
                transliteration: "La ilaha illallahu wahdahu la sharika lah, lahul mulku wa lahul hamdu wa huwa 'ala kulli shay'in qadeer, la ilaha illallahu wahdahu, anjaza wa'dahu wa nasara 'abdahu wa hazamal ahzaba wahdahu",
                translation: "There is no deity worthy of worship except Allah alone, without partner. To Him belongs all sovereignty and praise, and He is over all things competent. There is no deity worthy of worship except Allah alone. He fulfilled His promise, supported His servant, and defeated the confederates alone."
              }
            ]
          },
          {
            id: 4,
            name: "Plain of Arafat",
            arabicName: "صعيد عرفات",
            description: "Vast plain approximately 20 km east of Makkah where pilgrims stand in worship on the 9th of Dhul Hijjah - the most important day of Hajj. The site where the Hajj pilgrimage reaches its spiritual peak.",
            historicalSignificance: "Site where Prophet Muhammad (PBUH) delivered his farewell sermon to 140,000 companions, outlining fundamental human rights and Islamic principles. Place where Adam and Eve reunited after descending from Paradise. Known as the 'Mount of Mercy' area where dua is especially accepted.",
            spiritualSignificance: "Standing at Arafat is the essence of Hajj. Day of forgiveness, mercy, and acceptance of prayers. Pilgrims who miss standing at Arafat have missed Hajj. The day when Allah perfected the religion of Islam.",
            image: "arafat",
            location: "East of Makkah, Saudi Arabia",
            coordinates: "21.3557° N, 39.9853° E",
            specialFeatures: [
              "Jabal al-Rahmah (Mount of Mercy) - hill at center",
              "Masjid Namirah where Khutbah is delivered",
              "Vast plain accommodating millions of pilgrims",
              "Permanent facilities and services for pilgrims",
              "Historical monuments and signage explaining significance",
              "Water stations and medical facilities throughout",
              "Designated areas for different groups and nationalities"
            ],
            recommendedActivities: [
              "Spend day in continuous worship and supplication",
              "Listen to Khutbah at Masjid Namirah or via speakers",
              "Combine Dhuhr and Asr prayers at noon time",
              "Make sincere repentance for all sins - clean slate",
              "Pray for oneself, family, and entire Muslim Ummah",
              "Read Quran and make abundant dhikr throughout day",
              "Climb Jabal al-Rahmah if physically able"
            ],
            visitingTips: [
              "Arrive early to find good spot for worship - before noon",
              "Bring water, umbrella, and prayer mat - essential items",
              "Face Qibla while making dua - direction of Kaaba",
              "Raise hands in sincere supplication - humble posture",
              "Stay within Arafat boundaries until sunset - crucial requirement",
              "Be prepared for hot weather - protect from sun",
              "Follow instructions from authorities - safety first"
            ],
            duas: [
              {
                arabic: "لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
                transliteration: "La ilaha illallahu wahdahu la sharika lah, lahul mulku wa lahul hamdu, wa huwa 'ala kulli shay'in qadeer",
                translation: "There is no deity worthy of worship except Allah alone, without partner. To Him belongs all sovereignty and praise, and He is over all things competent."
              },
              {
                arabic: "اللَّهُمَّ لَكَ الْحَمْدُ كَالَّذِي تَقُولُ، وَخَيْرًا مِمَّا نَقُولُ، اللَّهُمَّ لَكَ صَلَّاتِي وَنُسُكِي وَمَحْيَايَ وَمَمَاتِي، وَإِلَيْكَ مَآبِي، وَأَنْتَ رَبِّي، اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ عَذَابِ الْقَبْرِ، وَوَسْوَسَةِ الصَّدْرِ، وَشَتَّاتِ الأَمْرِ",
                transliteration: "Allahumma lakal hamdu kalladhi taqulu, wa khairan mimma naqulu, allahumma laka salati wa nusuki wa mahyaya wa mamati, wa ilayka maabi, wa anta rabbi, allahumma inni a'udhu bika min 'adhabil qabri, wa waswasatis sadri, wa shattatil amri",
                translation: "O Allah, to You is praise like what we say, and better than what we say. O Allah, to You is my prayer, my sacrifice, my life, and my death. To You is my return, and You are my Lord. O Allah, I seek refuge in You from the punishment of the grave, the whispers of the chest, and the dispersion of affairs."
              }
            ]
          },
          {
            id: 5,
            name: "Mina",
            arabicName: "منى",
            description: "Tent city located between Makkah and Muzdalifah where pilgrims stay during the days of Hajj and perform the stoning ritual at Jamarat. Modern facilities provide comfort while maintaining traditional practices.",
            historicalSignificance: "Site where Prophet Ibrahim (AS) was commanded to sacrifice his son Ismail. Place where he rejected Satan's temptations, commemorated by stoning ritual. The area has been used for Hajj rituals since ancient times.",
            spiritualSignificance: "Represents obedience to Allah and rejection of evil. Place of reflection and worship during Hajj days. The stoning ritual symbolizes resistance against Satan's whispers.",
            image: "mina",
            location: "Between Makkah and Muzdalifah",
            coordinates: "21.4125° N, 39.8929° E",
            specialFeatures: [
              "Massive tent city with modern facilities",
              "Jamarat Bridge complex with multiple levels",
              "Air-conditioned tents with essential amenities",
              "Medical facilities and emergency services",
              "Food distribution centers throughout area",
              "Organized transportation systems",
              "Information centers and guidance services"
            ],
            recommendedActivities: [
              "Stay in tents during Hajj days (8th-13th Dhul Hijjah)",
              "Perform stoning of Jamarat pillars following schedule",
              "Reflect on story of Prophet Ibrahim and Ismail",
              "Spend time in remembrance and prayer in tents",
              "Rest and prepare for next rituals",
              "Interact with Muslims from around the world"
            ],
            visitingTips: [
              "Follow scheduled times for stoning to avoid crowds",
              "Use upper levels of Jamarat Bridge if possible - less crowded",
              "Stay hydrated and protect from sun - essential in heat",
              "Be patient and calm during rituals - avoid rush",
              "Follow instructions from authorities - safety measures",
              "Keep personal belongings secure in tents"
            ],
            duas: [
              {
                arabic: "اللَّهُمَّ اجْعَلْهُ حَجًّا مَبْرُورًا وَسَعْيًا مَشْكُورًا وَذَنْبًا مَغْفُورًا",
                transliteration: "Allahummaj'alhu hajjan mabrura wa sa'yan mashkura wa dhanban maghfura",
                translation: "O Allah, make it an accepted Hajj, and a striving that is thanked, and a sin that is forgiven."
              },
              {
                arabic: "بِسْمِ اللَّهِ وَاللَّهُ أَكْبَرُ رَغْمًا لِلشَّيْطَانِ وَحِزْبِهِ",
                transliteration: "Bismillahi wallahu akbar, raghman lishshaytani wa hizbih",
                translation: "In the name of Allah, and Allah is the Greatest, in defiance of Satan and his party."
              }
            ]
          },
          {
            id: 6,
            name: "Muzdalifah",
            arabicName: "مزدلفة",
            description: "Open area between Arafat and Mina where pilgrims spend the night under stars after leaving Arafat, collecting pebbles for stoning ritual. Simple accommodations emphasize humility before Allah.",
            historicalSignificance: "Site where pilgrims combine Maghrib and Isha prayers, collect pebbles, and spend night in worship. Part of Hajj rituals established by Prophet Muhammad (PBUH). The night spent here connects pilgrims to early Islamic traditions.",
            spiritualSignificance: "Night of reflection, prayer, and preparation for upcoming rituals. Blessed night for supplication. Simplicity of accommodations reminds of dependence on Allah.",
            image: "muzdalifah",
            location: "Between Arafat and Mina",
            coordinates: "21.3875° N, 39.9375° E",
            specialFeatures: [
              "Open area under sky - back to basics",
              "Pebble collection zones - organized areas",
              "Basic facilities and services - essential needs",
              "Lighting for night activities - safety measures",
              "Emergency and medical services - available throughout",
              "Water stations and basic amenities",
              "Guidance and information points"
            ],
            recommendedActivities: [
              "Combine Maghrib and Isha prayers at Isha time",
              "Collect 49-70 pebbles for stoning ritual",
              "Spend night in worship and remembrance",
              "Rest and prepare for next day's activities",
              "Make sincere dua during blessed night",
              "Reflect on spiritual journey so far"
            ],
            visitingTips: [
              "Collect pebbles from clean areas - proper size",
              "Rest when possible to conserve energy - long day ahead",
              "Stay with group and follow instructions - avoid getting lost",
              "Be prepared for outdoor conditions - weather variations",
              "Make most of spiritual atmosphere - unique opportunity",
              "Keep pebbles secure for stoning ritual"
            ],
            duas: [
              {
                arabic: "سُبْحَانَ اللَّهِ وَالْحَمْدُ لِلَّهِ وَلاَ إِلَهَ إِلاَّ اللَّهُ وَاللَّهُ أَكْبَرُ",
                transliteration: "Subhanallahi wal hamdulillahi wa la ilaha illallahu wallahu akbar",
                translation: "Glory be to Allah, and praise be to Allah, and there is no deity worthy of worship except Allah, and Allah is the Greatest."
              },
              {
                arabic: "اللَّهُمَّ اجْعَلْ فِي قَلْبِي نُورًا، وَفِي لِسَانِي نُورًا، وَاجْعَلْ فِي سَمْعِي نُورًا، وَاجْعَلْ فِي بَصَرِي نُورًا",
                transliteration: "Allahummaj'al fi qalbi nura, wa fi lisani nura, waj'al fi sam'i nura, waj'al fi basari nura",
                translation: "O Allah, place light in my heart, light in my tongue, light in my hearing, and light in my seeing."
              }
            ]
          },
          {
            id: 7,
            name: "Masjid an-Nabawi",
            arabicName: "المسجد النبوي",
            description: "The Prophet's Mosque in Madinah, second holiest site in Islam. Built by Prophet Muhammad (PBUH) himself and contains his final resting place. Continuously expanded while preserving historical elements.",
            historicalSignificance: "Originally built by Prophet Muhammad (PBUH) in 622 CE after Hijrah. Expanded multiple times throughout history by various caliphs and kings. Contains graves of Prophet Muhammad (PBUH), Abu Bakr, and Umar (RA). Site of many important Islamic events.",
            spiritualSignificance: "Prayer here equals 1,000 prayers elsewhere. Contains Rawdah (Garden of Paradise) between Prophet's minbar and his room. Visiting the Prophet's mosque is highly recommended Sunnah.",
            image: "masjid_nabawi",
            location: "Madinah, Saudi Arabia",
            coordinates: "24.4686° N, 39.6111° E",
            specialFeatures: [
              "Rawdah (area between Prophet's minbar and room) - Garden of Paradise",
              "Green Dome over Prophet's burial chamber - iconic feature",
              "Original Qibla direction marker - historical significance",
              "Massive expandable umbrellas for shade - engineering marvel",
              "Advanced architectural features while preserving history",
              "Library containing ancient Islamic manuscripts",
              "Museum showcasing Islamic history and artifacts"
            ],
            recommendedActivities: [
              "Pray in Rawdah (Garden of Paradise) if possible - great blessing",
              "Send salutations to Prophet Muhammad (PBUH) - recommended practice",
              "Visit graves of Prophet and his companions - with proper etiquette",
              "Pray all five daily prayers in congregation - increased rewards",
              "Learn about Islamic history in Madinah - educational opportunity",
              "Read Quran in the mosque - spiritual atmosphere",
              "Observe the architectural beauty - blend of old and new"
            ],
            visitingTips: [
              "Visit Rawdah during less crowded times - early morning/late night",
              "Maintain respect and decorum throughout visit - sacred site",
              "Learn proper etiquette for sending salutations - follow Sunnah",
              "Dress modestly and appropriately - requirement for mosque",
              "Be patient in crowded areas - especially near Rawdah",
              "Follow designated areas for men and women - mosque guidelines",
              "Take guided tour if available - learn historical significance"
            ],
            duas: [
              {
                arabic: "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ، اللَّهُمَّ بَارِكْ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ كَمَا بَارَكْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ",
                transliteration: "Allahumma salli 'ala Muhammadin wa 'ala ali Muhammadin kama sallayta 'ala Ibrahima wa 'ala ali Ibrahima innaka hamidum majid, allahumma barik 'ala Muhammadin wa 'ala ali Muhammadin kama barakta 'ala Ibrahima wa 'ala ali Ibrahima innaka hamidum majid",
                translation: "O Allah, send prayers upon Muhammad and the family of Muhammad as You sent prayers upon Ibrahim and the family of Ibrahim. Indeed, You are Praiseworthy and Glorious. O Allah, send blessings upon Muhammad and the family of Muhammad as You sent blessings upon Ibrahim and the family of Ibrahim. Indeed, You are Praiseworthy and Glorious."
              },
              {
                arabic: "السَّلاَمُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ",
                transliteration: "Assalamu 'alayka ayyuhan nabiyyu wa rahmatullahi wa barakatuh",
                translation: "Peace be upon you, O Prophet, and the mercy of Allah and His blessings."
              }
            ]
          },
          {
            id: 8,
            name: "Jabal an-Nour & Cave Hira",
            arabicName: "جبل النور وغار حراء",
            description: "Mountain of Light containing Cave Hira where Prophet Muhammad (PBUH) received his first revelation from Allah through Angel Jibreel. The cave is where Islam began with the revelation of first Quranic verses.",
            historicalSignificance: "Site where first verses of Quran were revealed to Prophet Muhammad (PBUH) in 610 CE. Place where Prophet spent long periods in meditation before prophethood. The mountain gets its name 'Mountain of Light' from the divine revelation that illuminated the world.",
            spiritualSignificance: "Birthplace of Islamic revelation. Symbol of spiritual retreat and connection with Allah. The cave represents the beginning of Prophet's mission and the importance of contemplation in Islam.",
            image: "hira_cave",
            location: "Northeast of Makkah",
            coordinates: "21.4575° N, 39.8592° E",
            specialFeatures: [
              "Cave Hira at summit - small natural cave",
              "Steep climbing path - challenging ascent",
              "Historical signage and information - educational value",
              "View of Makkah from summit - panoramic scenery",
              "Spiritual atmosphere - sense of history",
              "Resting points along climbing path"
            ],
            recommendedActivities: [
              "Climb the mountain if physically able - rewarding experience",
              "Visit Cave Hira and reflect on first revelation - historical moment",
              "Read first revealed verses of Quran (Surah Al-Alaq) - in context",
              "Make dua and remember the significance of the place - spiritual connection",
              "Learn about Prophet's life before prophethood - educational",
              "Take photographs of the view - memorable experience"
            ],
            visitingTips: [
              "Climb during cooler hours (early morning or evening) - avoid heat",
              "Wear comfortable shoes for climbing - essential for steep path",
              "Bring water and necessary supplies - no facilities on mountain",
              "Be physically prepared for steep climb - challenging terrain",
              "Respect the sanctity of the place - historical significance",
              "Follow safety guidelines - steep drops in areas"
            ],
            duas: [
              {
                arabic: "اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ",
                transliteration: "Iqra bismi rabbikal ladhi khalaq",
                translation: "Read in the name of your Lord who created."
              },
              {
                arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا وَرِزْقًا طَيِّبًا وَعَمَلاً مُتَقَبَّلاً",
                transliteration: "Allahumma inni as'aluka 'ilman nafi'an wa rizqan tayyiban wa 'amalan mutaqabbalan",
                translation: "O Allah, I ask You for beneficial knowledge, good provision, and accepted deeds."
              }
            ]
          },
          {
            id: 9,
            name: "Jannat al-Mu'alla",
            arabicName: "جنة المعلى",
            description: "Historic cemetery in Makkah containing graves of many relatives and companions of Prophet Muhammad (PBUH), including his first wife Khadijah (RA). A place of historical significance and reflection.",
            historicalSignificance: "Burial place of Prophet's grandfather Abdul Muttalib, his first wife Khadijah bint Khuwaylid, and other early Muslims from Quraysh tribe. Many companions and family members of Prophet are buried here from early Islamic period.",
            spiritualSignificance: "Place to remember early Muslims and learn from their sacrifices for Islam. Opportunity to reflect on mortality and the temporary nature of this world. Historical connection to Prophet's family and companions.",
            image: "jannat_mualla",
            location: "Northern Makkah, near Masjid al-Haram",
            coordinates: "21.4350° N, 39.8264° E",
            specialFeatures: [
              "Grave of Khadijah bint Khuwaylid (RA) - first Muslim and Prophet's wife",
              "Grave of Abdul Muttalib - Prophet's grandfather",
              "Graves of other early Muslims and companions",
              "Historical significance markers - educational information",
              "Peaceful atmosphere for reflection - away from city noise",
              "Well-maintained cemetery - respect for deceased"
            ],
            recommendedActivities: [
              "Visit and remember the early Muslims buried here - historical connection",
              "Learn about lives of Khadijah (RA) and other companions - educational",
              "Make dua for the deceased - Islamic practice",
              "Reflect on Islamic history and sacrifices - spiritual lesson",
              "Read about lives of those buried here - before visiting",
              "Observe proper cemetery etiquette - respect for deceased"
            ],
            visitingTips: [
              "Maintain respectful behavior - sacred cemetery",
              "Avoid innovations or practices not from Sunnah - follow authentic Islam",
              "Make sincere dua for the deceased - recommended practice",
              "Learn proper Islamic visitation etiquette - before visiting",
              "Reflect on lessons from their lives - spiritual benefit",
              "Visit during daylight hours - safety and respect"
            ],
            duas: [
              {
                arabic: "السَّلاَمُ عَلَى أَهْلِ الدِّيَارِ مِنَ الْمُؤْمِنِينَ وَالْمُسْلِمِينَ، وَيَرْحَمُ اللَّهُ الْمُسْتَقْدِمِينَ مِنَّا وَالْمُسْتَأْخِرِينَ، وَإِنَّا إِنْ شَاءَ اللَّهُ بِكُمْ لَلاَحِقُونَ",
                transliteration: "Assalamu 'ala ahli diyari minal mu'minina wal muslimin, wa yarhamullahul mustaqdimina minna wal musta'khirin, wa inna in sha'allahu bikum la lahiqun",
                translation: "Peace be upon the believing and Muslim people of these abodes. May Allah have mercy on those who have gone ahead of us and those who will follow. And we, if Allah wills, will certainly join you."
              }
            ]
          },
          {
            id: 10,
            name: "Masjid al-Qiblatayn",
            arabicName: "مسجد القبلتين",
            description: "Mosque in Madinah where Prophet Muhammad (PBUH) received revelation to change Qibla direction from Jerusalem to Makkah during prayer. Historical evidence of Quranic revelation in action.",
            historicalSignificance: "Site where direction of prayer was changed from Jerusalem to Makkah in 2 AH (624 CE). Demonstrates evolution of Islamic practices and obedience to divine command. The mosque preserves both Qibla directions.",
            spiritualSignificance: "Historical evidence of Quranic revelation and change in prayer direction. Important Islamic historical site showing flexibility in Islamic practices according to divine guidance. Lesson in obedience to Allah's commands.",
            image: "qiblatayn",
            location: "Madinah, Saudi Arabia",
            coordinates: "24.4842° N, 39.5786° E",
            specialFeatures: [
              "Two mihrabs indicating both Qibla directions - unique feature",
              "Historical architecture - preserved structure",
              "Educational displays about the event - historical context",
              "Peaceful prayer atmosphere - less crowded",
              "Well-maintained historical site - preservation efforts",
              "Information about the Quranic revelation - educational value"
            ],
            recommendedActivities: [
              "Perform prayer in the mosque - experience history",
              "Learn about historical event of Qibla change - educational",
              "Read related Quranic verses (Surah Al-Baqarah 2:142-150) - in context",
              "Reflect on significance of Qibla direction - spiritual lesson",
              "Appreciate Islamic architectural heritage - historical value",
              "Take photographs of unique two-mihrab design"
            ],
            visitingTips: [
              "Perform at least two rak'ahs of prayer - recommended practice",
              "Learn the story before visiting - better appreciation",
              "Respect the historical significance - important site",
              "Take time to reflect on the event - spiritual benefit",
              "Visit during less crowded times - more peaceful experience",
              "Follow mosque etiquette - respect sacred space"
            ],
            duas: [
              {
                arabic: "وَلِلَّهِ الْمَشْرِقُ وَالْمَغْرِبُ فَأَيْنَمَا تُوَلُّوا فَثَمَّ وَجْهُ اللَّهِ إِنَّ اللَّهَ وَاسِعٌ عَلِيمٌ",
                transliteration: "Wa lillahil mashriqu wal maghribu fa aynamma tuwallu fathamma wajhullah, innallaha wasi'un 'alim",
                translation: "And to Allah belongs the east and the west. So wherever you turn, there is the Face of Allah. Indeed, Allah is all-Encompassing and Knowing."
              }
            ]
          }
        ]
      };
    }
  
    // Get Hajj steps
    getHajjSteps() {
      return this.guideData.hajj;
    }
  
    // Get Umrah steps
    getUmrahSteps() {
      return this.guideData.umrah;
    }
  
    // Get important places
    getImportantPlaces() {
      return this.guideData.importantPlaces;
    }
  
    // Get specific place by ID
    getPlaceById(id) {
      return this.guideData.importantPlaces.find(place => place.id === id);
    }
  
    // Get step by ID for Hajj or Umrah
    getStepById(type, stepId) {
      const guide = type === 'hajj' ? this.guideData.hajj : this.guideData.umrah;
      return guide.steps.find(step => step.id === stepId);
    }
  
    // Get quick tips for Hajj or Umrah
    getQuickTips(type) {
      const tips = {
        hajj: [
          "Start learning Hajj procedures months in advance - don't wait until arrival",
          "Practice physical stamina through regular walking and exercise",
          "Learn basic Arabic phrases for communication with international pilgrims",
          "Pack light but include essential medications and personal items",
          "Make sincere intention for Allah alone - avoid showing off",
          "Study the meanings of rituals to enhance spiritual experience",
          "Keep important documents and money secure at all times",
          "Stay hydrated and protect yourself from sun exposure",
          "Be patient and courteous with fellow pilgrims from diverse backgrounds",
          "Focus on spiritual benefits rather than material comforts"
        ],
        umrah: [
          "Can be performed anytime except the 5 days of Hajj (8th-12th Dhul Hijjah)",
          "No specific date or time requirements - flexible throughout year",
          "Much shorter duration than Hajj - typically 2-3 hours",
          "Can be performed multiple times - no restrictions on frequency",
          "Great practice for future Hajj - learn rituals in simpler form",
          "Ideal for family members who cannot perform Hajj yet",
          "Can be combined with visit to Madinah and other historical sites",
          "Less physically demanding than Hajj - suitable for all ages",
          "Opportunity for spiritual renewal at any time of year",
          "Can be performed during Ramadan for multiplied rewards"
        ]
      };
      return tips[type] || [];
    }
  
    // Get common mistakes to avoid
    getCommonMistakes(type) {
      const mistakes = {
        hajj: [
          "Delaying learning procedures until arrival - causes confusion and stress",
          "Overpacking unnecessary items - creates burden during movement",
          "Not staying hydrated in hot weather - leads to health issues",
          "Rushing through rituals without understanding - reduces spiritual benefits",
          "Neglecting prayers and remembrance during free times - missed opportunities",
          "Arguing or being impatient with fellow pilgrims - against Hajj spirit",
          "Focusing on photography more than worship - distracts from purpose",
          "Not following safety instructions from authorities - risks safety",
          "Skipping recommended Sunnah practices - misses extra rewards",
          "Returning to previous sins after Hajj - negates spiritual cleansing"
        ],
        umrah: [
          "Crossing Miqat without Ihram - invalidates Umrah",
          "Starting Tawaf from wrong position - must begin from Black Stone",
          "Not completing exact number of circuits - seven required for Tawaf and Sa'i",
          "Neglecting prayers after Tawaf - two rak'ahs at Maqam Ibrahim recommended",
          "Not making sincere intention - essential for validity",
          "Rushing through rituals without concentration - reduces spiritual benefits",
          "Not drinking Zamzam water - missed blessing",
          "Forgetting to make abundant dua - especially at Multazam",
          "Not learning proper procedures beforehand - causes mistakes",
          "Treating Umrah as tourism rather than worship - wrong intention"
        ]
      };
      return mistakes[type] || [];
    }
  
    // Get Miqat locations with details
    getMiqatLocations() {
      return [
        {
          name: "Dhul Hulayfah",
          alsoKnownAs: "Abyar Ali",
          distance: "450km from Makkah",
          forPilgrims: "Coming from Madinah direction",
          modernLocation: "Near Madinah"
        },
        {
          name: "Al-Juhfah",
          alsoKnownAs: "Rabigh",
          distance: "190km from Makkah",
          forPilgrims: "Coming from Syria, Egypt, Morocco direction",
          modernLocation: "Near Rabigh city"
        },
        {
          name: "Qarn al-Manazil",
          alsoKnownAs: "As-Sayl",
          distance: "90km from Makkah",
          forPilgrims: "Coming from Najd, Riyadh direction",
          modernLocation: "Near Taif"
        },
        {
          name: "Yalamlam",
          alsoKnownAs: "Al-Miqat",
          distance: "100km from Makkah",
          forPilgrims: "Coming from Yemen direction",
          modernLocation: "South of Makkah"
        },
        {
          name: "Dhat 'Irq",
          alsoKnownAs: "Ad-Darb",
          distance: "100km from Makkah",
          forPilgrims: "Coming from Iraq, Iran direction",
          modernLocation: "Northeast of Makkah"
        }
      ];
    }
  
    // Get recommended packing list
    getPackingList(type) {
      const lists = {
        hajj: [
          "Ihram sets (2-3 sets recommended)",
          "Comfortable walking shoes with good grip",
          "Personal medications and first aid kit",
          "Sunscreen, hat, and sunglasses",
          "Prayer mat and compass for Qibla",
          "Money belt and important documents",
          "Mobile phone with charger and power bank",
          "Snacks and energy bars",
          "Water bottle and hydration supplies",
          "Light backpack for daily use"
        ],
        umrah: [
          "Ihram sets (1-2 sets sufficient)",
          "Comfortable shoes for walking",
          "Personal medications",
          "Prayer mat and Quran",
          "Important documents and money",
          "Mobile phone and charger",
          "Simple snacks and water",
          "Small backpack for essentials"
        ]
      };
      return lists[type] || [];
    }
  
    // Get spiritual preparation tips
    getSpiritualPreparation() {
      return [
        "Increase in voluntary prayers and fasting",
        "Recite and understand meanings of Quranic verses related to Hajj/Umrah",
        "Learn and practice Talbiyah and other pilgrimage prayers",
        "Make sincere repentance for all sins",
        "Settle disputes and seek forgiveness from others",
        "Practice patience and good character",
        "Make sincere intention for Allah's pleasure alone",
        "Study the life of Prophet Muhammad (PBUH) and his Hajj",
        "Learn about the significance of each ritual",
        "Prepare mentally for physical challenges and spiritual rewards"
      ];
    }
  }
  
  export default new HajjUmrahService();