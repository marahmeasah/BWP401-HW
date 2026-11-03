document.addEventListener('DOMContentLoaded', () => {
    //   Read the event number from the link  
    const eventId = new URLSearchParams(window.location.search).get('id') || '1';

    // Event data 
    const eventsData = {
        1: {
            category: 'تقنية',
            title: 'ملتقى التقنية والذكاء الاصطناعي 2026',
            date: '2026-10-20',
            time: 'من 10:00 صباحاً إلى 3:00 مساءً',
            location: 'دمشق',
            description: 'مؤتمر علمي يستعرض أحدث تطبيقات الذكاء الاصطناعي في بناء المواقع العصرية',
            more: 'يجمع الملتقى المهتمين بالتقنية والذكاء الاصطناعي لمناقشة أحدث التطورات.'
        },
        2: {
            category: 'ثقافة',
            title: 'المعرض السنوي للكتاب والمشاريع',
            date: '2026-10-25',
            time: 'سيُعلن لاحقاً',
            location: 'حلب',
            description: 'عرض لأبرز مشاريع التخرج المتميزة مع ندوات ثقافية وحوارية مفتوحة للطلاب',
            more: 'يتضمن المعرض عرض المشاريع والأنشطة الثقافية للطلاب.'
        },
        3: {
            category: 'رياضة',
            title: 'بطولة الجامعة للشطرنج',
            date: '2026-10-28',
            time: 'سيُعلن لاحقاً',
            location: 'حمص',
            description: 'تحديات ذهنية بين طلاب مختلف البرامج الأكاديمية لتتويج بطل الجامعة لهذا الفصل',
            more: 'تجمع البطولة الطلاب المشاركين في منافسات الشطرنج.'
        },
        4: {
            category: 'موسيقى',
            title: 'الأمسية الموسيقية لنادي الطلاب',
            date: '2026-11-01',
            time: 'سيُعلن لاحقاً',
            location: 'اللاذقية',
            description: 'حفل موسيقي شبابي يقدمه طلاب الجامعة الموهوبون بالعزف والغناء التراثي والمعاصر',
            more: 'أمسية فنية يقدم خلالها الطلاب مواهبهم الموسيقية.'
        },
        5: {
            category: 'تقنية',
            title: 'معسكر البرمجة التنافسي (SVU CPC)',
            date: '2026-11-05',
            time: 'سيُعلن لاحقاً',
            location: 'أونلاين',
            description: 'تدريب مكثف على الخوارزميات وحل المشكلات البرمجية تأهيلاً للمسابقات الإقليمية.',
            more: 'يركز المعسكر على التدريب العملي وحل المسائل البرمجية.'
        },
        6: {
            category: 'عائلي',
            title: 'اليوم المفتوح للعائلات والخريجين',
            date: '2026-11-10',
            time: 'سيُعلن لاحقاً',
            location: 'دمشق',
            description: 'نشاط اجتماعي ترفيهي يجمع الطلاب وعائلاتهم مع الخريجين لتبادل الخبرات وتكريم المتفوقين',
            more: 'يهدف النشاط إلى تعزيز التواصل بين الطلاب والخريجين وعائلاتهم.'
        }
    };

    //   Selecting the required activity
    const selectedEvent = eventsData[eventId];

    // Update page details
    if (selectedEvent && document.getElementById('eventTitle')) {
        document.getElementById('eventCategory').textContent = selectedEvent.category;
        document.getElementById('eventTitle').textContent = selectedEvent.title;
        document.getElementById('eventDate').textContent = selectedEvent.date;
        document.getElementById('eventTime').textContent = selectedEvent.time;
        document.getElementById('eventLocation').textContent = selectedEvent.location;
        document.getElementById('eventDescription').textContent = selectedEvent.description;
        document.getElementById('eventDescriptionMore').textContent = selectedEvent.more;
    }

    // 1.Add the dark mode feature (Bonus: Dark Mode) by switching the CSS class and saving it in localStorage.

    const darkModeBtn = document.getElementById('darkModeToggle');
    const savedTheme = localStorage.getItem('svu_theme');

    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        if (darkModeBtn) darkModeBtn.innerHTML = '<i class="bi bi-sun-fill"></i>';
    }

    if (darkModeBtn) {
        darkModeBtn.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const isDark = document.body.classList.contains('dark-mode');
            localStorage.setItem('svu_theme', isDark ? 'dark' : 'light');
            darkModeBtn.innerHTML = isDark
                ? '<i class="bi bi-sun-fill"></i>'
                : '<i class="bi bi-moon-stars-fill"></i>';
        });
    }


    // 2.Bonus: Scroll-to-top Button

    const scrollTopBtn = document.getElementById('scrollTopBtn');
    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            scrollTopBtn.style.display = window.scrollY > 300 ? 'flex' : 'none';
        });

        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }


    // 3. Filter the events list by (category, date, location, and name) + save preferences

    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    const locationFilter = document.getElementById('locationFilter');
    const dateFilter = document.getElementById('dateFilter');
    const resetFilterBtn = document.getElementById('resetFilterBtn');
    const eventItems = document.querySelectorAll('.event-item');
    const noResultsMsg = document.getElementById('noResultsMsg');

    function filterEvents() {
        if (eventItems.length === 0) return;

        const searchVal = searchInput ? searchInput.value.toLowerCase().trim() : '';
        const catVal = categoryFilter ? categoryFilter.value : 'all';
        const locVal = locationFilter ? locationFilter.value : 'all';
        const dateVal = dateFilter ? dateFilter.value : '';

        //  Save classification preferences in localStorage (Bonus)
        if (categoryFilter) {
            localStorage.setItem('preferred_category', catVal);
        }

        let visibleCount = 0;

        eventItems.forEach(item => {
            const title = item.getAttribute('data-title').toLowerCase();
            const category = item.getAttribute('data-category');
            const location = item.getAttribute('data-location');
            const date = item.getAttribute('data-date');

            const matchSearch = title.includes(searchVal);
            const matchCat = (catVal === 'all' || category === catVal);
            const matchLoc = (locVal === 'all' || location === locVal);
            const matchDate = (dateVal === '' || date === dateVal);

            if (matchSearch && matchCat && matchLoc && matchDate) {
                item.style.display = 'block';
                visibleCount++;
            } else {
                item.style.display = 'none';
            }
        });

        if (noResultsMsg) {
            noResultsMsg.classList.toggle('d-none', visibleCount > 0);
        }
    }

    // Retrieve saved favorite event rankings
    if (categoryFilter) {
        const savedCat = localStorage.getItem('preferred_category');
        if (savedCat) {
            categoryFilter.value = savedCat;
            filterEvents();
        }
        categoryFilter.addEventListener('change', filterEvents);
    }

    if (searchInput) searchInput.addEventListener('input', filterEvents);
    if (locationFilter) locationFilter.addEventListener('change', filterEvents);
    if (dateFilter) dateFilter.addEventListener('change', filterEvents);

    if (resetFilterBtn) {
        resetFilterBtn.addEventListener('click', () => {
            if (searchInput) searchInput.value = '';
            if (categoryFilter) categoryFilter.value = 'all';
            if (locationFilter) locationFilter.value = 'all';
            if (dateFilter) dateFilter.value = '';
            localStorage.removeItem('preferred_category');
            filterEvents();
        });
    }

    //Linking the quick category buttons on the homepage saves preferences and allows navigation to the events page.
    document.querySelectorAll('.quick-filter-badge').forEach(badge => {
        badge.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.setItem('preferred_category', badge.getAttribute('data-cat'));
            window.location.href = 'events.html';
        });
    });


    // 4.(Bootstrap Alerts) Simple verification of the "Contact Us" form and display of success/error messages

    const contactForm = document.getElementById('contactForm');
    const alertContainer = document.getElementById('alertContainer');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('contactName').value.trim();
            const email = document.getElementById('contactEmail').value.trim();
            const message = document.getElementById('contactMessage').value.trim();

            // Check the email format
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!name || !email || !message) {
                showAlert('danger', 'يرجى تعبئة كافة الحقول المطلوبة (الاسم، البريد، والرسالة).');
                return;
            }

            if (!emailPattern.test(email)) {
                showAlert('danger', 'يرجى إدخال صيغة بريد إلكتروني صحيحة (مثال: user@svuonline.org).');
                return;
            }

            if (message.length < 10) {
                showAlert('warning', 'يجب أن تحتوي الرسالة على 10 أحرف على الأقل.');
                return;
            }

            showAlert('success', 'تم التحقق من البيانات، لكن هذه النسخة التجريبية لا ترسل الرسائل فعلياً. يرجى استخدام البريد events@svuonline.org لإرسال رسالتك.');
            contactForm.reset();
        });
    }

    function showAlert(type, messageText) {
        if (!alertContainer) return;
        alertContainer.innerHTML = `
            <div class="alert alert-${type} alert-dismissible fade show rounded-4 shadow-sm" role="alert">
                <i class="bi bi-info-circle-fill me-2"></i> ${messageText}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `;
    }


    // 5.Interactive buttons on the details page (event.html) and mock booking window (Modal)

    const addToCalBtn = document.getElementById('addToCalBtn');
    const shareEventBtn = document.getElementById('shareEventBtn');
    const bookingForm = document.getElementById('bookingForm');

    if (addToCalBtn) {
        addToCalBtn.addEventListener('click', () => {

            // Event date/time/location are copied from the details displayed on this page.
            const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');

            const eventStart = selectedEvent.date.replaceAll('-', '');

            const nextDay = new Date(selectedEvent.date + 'T00:00:00Z');
            nextDay.setUTCDate(nextDay.getUTCDate() + 1);

            const eventEnd = nextDay.toISOString().slice(0, 10).replaceAll('-', '');
            const timeMatch = selectedEvent.time.match(
                /من\s*(\d{1,2}):(\d{2})\s*(صباحاً|مساءً)\s*إلى\s*(\d{1,2}):(\d{2})\s*(صباحاً|مساءً)/
            );

            const to24Hour = (hour, period) => {
                let h = Number(hour) % 12;
                if (period === 'مساءً') h += 12;
                return String(h).padStart(2, '0');
            };

            const calendarTimeLines = timeMatch
                ? [
                    'DTSTART:' + eventStart.replace(/-/g, '') + 'T' + to24Hour(timeMatch[1], timeMatch[3]) + timeMatch[2] + '00',
                    'DTEND:' + eventStart.replace(/-/g, '') + 'T' + to24Hour(timeMatch[4], timeMatch[6]) + timeMatch[5] + '00'
                ]
                : [
                    calendarTimeLines
                ];
            const ics = [
                'BEGIN:VCALENDAR',
                'VERSION:2.0',
                'PRODID:-//SVU Events Guide//AR',
                'BEGIN:VEVENT',
                'UID:svu-event-' + eventId + '@svuonline.org',
                'DTSTAMP:' + stamp,
                'DTSTART;VALUE=DATE:' + eventStart,
                'DTEND;VALUE=DATE:' + eventEnd,
                'SUMMARY:' + selectedEvent.title,
                'LOCATION:' + selectedEvent.location,
                'DESCRIPTION:' + selectedEvent.description,
                'END:VEVENT',
                'END:VCALENDAR'
            ].join('\r\n');
            const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'svu-event-' + eventId + '.ics';
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.setTimeout(() => URL.revokeObjectURL(url), 1000);
        });
    }

    if (shareEventBtn) {
        shareEventBtn.addEventListener('click', async () => {
            const shareData = { title: document.title, url: window.location.href };
            try {
                if (navigator.share) {
                    await navigator.share(shareData);
                } else if (navigator.clipboard && navigator.clipboard.writeText) {
                    await navigator.clipboard.writeText(window.location.href);
                    alert('تم نسخ رابط الفعالية بنجاح.');
                } else {
                    window.prompt('انسخ رابط الفعالية يدوياً:', window.location.href);
                }
            } catch (error) {
                if (error.name !== 'AbortError') window.prompt('تعذر إتمام المشاركة. انسخ الرابط:', window.location.href);
            }
        });
    }

    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const attendeeName = document.getElementById('attendeeName').value.trim();
            const body = document.getElementById('bookingModalBody');
            const wrapper = document.createElement('div');
            wrapper.className = 'text-center py-4';
            const icon = document.createElement('i');
            icon.className = 'bi bi-info-circle-fill text-primary display-4 mb-3 d-block';
            const heading = document.createElement('h5');
            heading.className = 'fw-bold';
            heading.textContent = 'تم التحقق من بيانات الحجز التجريبي';
            const message = document.createElement('p');
            message.className = 'text-muted mb-0';
            message.append('أهلاً بك يا ');
            const name = document.createElement('strong');
            name.textContent = attendeeName;
            message.append(name, '؛ لم يُرسل الحجز إلى خادم ولم يُسجل فعلياً.');
            wrapper.append(icon, heading, message);
            body.replaceChildren(wrapper);
        });
    }
});