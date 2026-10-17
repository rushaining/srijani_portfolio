document.addEventListener("DOMContentLoaded", () => {

    // ==========================================
    // 1. YEARS OF LEARNING CALCULATOR
    // ==========================================
    function updateYearsOfLearning() {
        const startDate = new Date('2021-01-01');
        const currentDate = new Date();
        
        const diffTime = Math.abs(currentDate - startDate);
        const diffYears = diffTime / (1000 * 60 * 60 * 24 * 365.25);
        
        const baseYears = Math.floor(diffYears); 
        const decimalYears = diffYears.toFixed(1); 
        
        const yoeValElement = document.getElementById('yoe-val');
        const yoeBarElement = document.getElementById('yoe-bar');
        
        if (yoeValElement && yoeBarElement) {
            yoeValElement.textContent = baseYears + "+";
            const targetHeightPercent = Math.min(decimalYears * 10, 95); 
            yoeBarElement.style.setProperty('--target-height', targetHeightPercent + '%');
        }
    }

    updateYearsOfLearning();
    
    // ==========================================
    // 2. RUN ALL BUTTON
    // ==========================================
    document.getElementById("run-all-btn").addEventListener("click", () => {
        window.location.reload();
    });

    let executionCounter = 1;

    // ==========================================
    // 3. SCROLL OBSERVER (Triggers the cells)
    // ==========================================
    const observerOptions = {
        root: null,
        rootMargin: "0px",
        threshold: 0.15 
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const section = entry.target;
                section.classList.add("in-view");
                executeCell(section);
                observer.unobserve(section); 
            }
        });
    }, observerOptions);

    document.querySelectorAll(".notebook-section").forEach(section => {
        sectionObserver.observe(section);
    });

    // ==========================================
    // 4. THE EXECUTION SIMULATION
    // ==========================================
    function executeCell(section) {
        const runIndicator = section.querySelector(".run-indicator");
        const execCount = section.querySelector(".execution-count");
        const outputCell = section.querySelector(".output-cell");
        const contentBox = section.querySelector(".cell-content-box");

        if (runIndicator && runIndicator.classList.contains("running")) return;

        if (runIndicator) {
            runIndicator.classList.add("running");
        }

        if (outputCell) {
            outputCell.classList.remove("visible");
            contentBox.classList.remove("has-output"); 
            
            if (section.id === "section-stats") {
                section.querySelectorAll(".bar").forEach(bar => {
                    bar.style.transition = "none"; 
                    bar.style.height = "0";
                    void bar.offsetWidth;
                    bar.style.transition = "height 1s cubic-bezier(0.1, 0.8, 0.2, 1)"; 
                });
                const shatter = section.querySelector(".shatter-effect");
                if (shatter) {
                    shatter.style.transition = "none";
                    shatter.style.opacity = "0";
                    void shatter.offsetWidth;
                    shatter.style.transition = "opacity 0.5s ease";
                }
            }
        }

        setTimeout(() => {
            if (runIndicator) {
                runIndicator.classList.remove("running");
            }

            if (execCount) {
                execCount.textContent = `[${executionCounter}]`;
                executionCounter++;
            }

            if (outputCell) {
                outputCell.classList.add("visible");
                contentBox.classList.add("has-output"); 
            }

            if (section.id === "section-stats") animateStatsChart(section);
            if (section.id === "section-works") renderWorks();
            if (section.id === "section-skills") renderSkills();
            if (section.id === "section-exp") renderExperience();
            if (section.id === "section-achieve") renderAchievements();
            if (section.id === "section-creative") renderCreative();
            if (section.id === "section-works-full") renderFullWorks();
            if (section.id === "section-exp-full") renderFullExperience();

            if (section.id === "section-achieve-recent") renderAchieveRecent();
            if (section.id === "section-achieve-cred") renderAchieveCategory('credentials', 'achieve-cred-container');
            if (section.id === "section-achieve-recog") renderAchieveCategory('recognition', 'achieve-recog-container');
            if (section.id === "section-achieve-vol") renderAchieveCategory('volunteering', 'achieve-vol-container');
            if (section.id === "section-achieve-part") renderAchieveCategory('participation', 'achieve-part-container');

            if (section.id === "section-creative-full") renderFullCreative();
        }, 1000); 
    }

    document.querySelectorAll(".run-indicator").forEach(indicator => {
        indicator.addEventListener("click", (e) => {
            const section = e.target.closest(".notebook-section");
            if(section) {
                executeCell(section);
            }
        });
    });

    // ==========================================
    // 5. STATS CHART ANIMATION
    // ==========================================
    function animateStatsChart(section) {
        const bars = section.querySelectorAll(".bar");
        const shatter = section.querySelector(".shatter-effect"); 

        bars.forEach((bar, index) => {
            setTimeout(() => {
                const targetHeight = bar.getAttribute("style").match(/--target-height:\s*([^;]+)/)[1];
                bar.style.height = targetHeight;
            }, index * 200); 
        });

        if (shatter) {
            setTimeout(() => {
                shatter.style.opacity = "1";
            }, (bars.length * 200) + 1000); 
        }
    }

    // ==========================================
    // 6. RENDER WORKS 
    // ==========================================
    async function renderWorks() {
        try {
            const response = await fetch('json/works.json');
            const works = await response.json();
            const container = document.getElementById('works-container');
            
            if (!container) return;
            container.innerHTML = ''; 
            
            const featuredWorks = works
                .filter(work => work.featured === true)
                .slice(0, 3);
            
            featuredWorks.forEach(work => {
                const pillClass = work.type === 'RESEARCH' ? 'research' : 'project';
                const imageHtml = work.image 
                    ? `<img src="${work.image}" alt="${work.shortTitle}">`
                    : `<div class="bg-dark"></div>`;
                    
                const card = `
                    <div class="work-card">
                        <h4 class="card-title">${work.shortTitle}</h4>
                        <div class="card-img-wrapper">${imageHtml}</div>
                        <p class="card-desc">${work.shortDescription}</p>
                        <div class="card-meta" style="margin-bottom: 16px;">${work.tags.join(' &middot; ')}</div>
                        <div class="card-footer">
                            <span class="pill ${pillClass}">${work.type}</span>
                            <a href="${work.link || '#'}" class="arrow" target="_blank">
                                <svg class="arrow-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><path d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z"></path></svg>
                            </a>
                        </div>
                    </div>
                `;
                container.innerHTML += card;
            });
        } catch (error) {
            console.error("Error loading works:", error);
        }
    }

    // ==========================================
    // 7. RENDER SKILLS
    // ==========================================
    async function renderSkills() {
        try {
            const response = await fetch('json/skills.json');
            const skillsData = await response.json();
            const container = document.getElementById('skills-container');
            
            if (!container) return;
            container.innerHTML = ''; 
            
            const chartColors = [
                { bg: 'rgba(121, 123, 222, 0.3)', border: '#797ADE' }, 
                { bg: 'rgba(105, 143, 208, 0.3)', border: '#698FD0' }, 
                { bg: 'rgba(82, 169, 201, 0.3)', border: '#52A9C9' }, 
                { bg: 'rgba(52, 209, 199, 0.3)', border: '#34D1C7' }  
            ];

            skillsData.forEach((categoryData, index) => {
                const color = chartColors[index % chartColors.length];
                const labels = Object.keys(categoryData.skills);
                const dataValues = Object.values(categoryData.skills);
                
                const wrapper = document.createElement('div');
                wrapper.className = 'skill-spider';
                
                const canvas = document.createElement('canvas');
                wrapper.appendChild(canvas);
                
                const title = document.createElement('b');
                title.textContent = categoryData.category;
                title.style.marginTop = '12px';
                wrapper.appendChild(title);
                
                container.appendChild(wrapper);
                
                new Chart(canvas, {
                    type: 'radar',
                    data: {
                        labels: labels,
                        datasets: [{
                            data: dataValues,
                            backgroundColor: color.bg,
                            borderColor: color.border,
                            borderWidth: 1.5,
                            pointBackgroundColor: color.border,
                            pointRadius: 2
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: true,
                        plugins: { legend: { display: false }, tooltip: { enabled: false } },
                        scales: {
                            r: {
                                min: 1,
                                max: 5,
                                ticks: {
                                    stepSize: 1,
                                    callback: function(value) {
                                        if (value === 1 || value === 3 || value === 5) return value;
                                        return '';
                                    },
                                    font: { family: 'Arial', size: 9 },
                                    color: '#999',
                                    backdropColor: 'transparent'
                                },
                                grid: { color: '#eaeaea' },
                                angleLines: { color: '#eaeaea' },
                                pointLabels: {
                                    font: { family: 'Consolas, monaco, monospace', size: 9 },
                                    color: '#000'
                                }
                            }
                        }
                    }
                });
            });
        } catch (error) {
            console.error("Error loading skills:", error);
        }
    }

    // ==========================================
    // 8. RENDER EXPERIENCE (Main Page Timeline)
    // ==========================================
    async function renderExperience() {
        const container = document.getElementById('experience-container');
        if (!container) return;

        try {
            const response = await fetch('json/experiences.json');
            if (!response.ok) throw new Error("Could not find the JSON file.");
            
            const data = await response.json();
            if (!Array.isArray(data)) throw new Error("JSON data is not properly formatted as an array.");
            
            container.innerHTML = ''; 

            function formatTimelineDate(dateStr) {
                if (!dateStr) return '';
                if (dateStr.length === 4) return dateStr; 
                const parts = dateStr.split('-');
                if (parts.length === 2) {
                    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                    return `${months[parseInt(parts[1], 10) - 1]} '${parts[0].slice(2)}`;
                }
                return dateStr; 
            }
            
            let htmlString = "";
            data.forEach(org => {
                if (!org.roles || org.roles.length === 0) return;
                
                const featuredRoles = org.roles.filter(r => r.featured);
                if (featuredRoles.length === 0) return;

                if (featuredRoles.length > 1) {
                    htmlString += `
                        <div class="timeline-item org-node">
                            <div class="time-date"></div>
                            <div class="time-content">
                                <div class="org-title">${org.organization}</div>
                            </div>
                        </div>
                    `;
                    featuredRoles.forEach(role => {
                        const dateDisplay = role.startDate 
                            ? `${formatTimelineDate(role.startDate)} - ${formatTimelineDate(role.endDate)}` 
                            : formatTimelineDate(role.endDate);
                        
                        htmlString += `
                            <div class="timeline-item role-node">
                                <div class="time-date">${dateDisplay}</div>
                                <div class="time-content">
                                    <div class="role-title">${role.title}</div>
                                    <div class="role-desc">${role.shortDescription || ''}</div>
                                </div>
                            </div>
                        `;
                    });
                } else {
                    const role = featuredRoles[0];
                    const dateDisplay = role.startDate 
                        ? `${formatTimelineDate(role.startDate)} - ${formatTimelineDate(role.endDate)}` 
                        : formatTimelineDate(role.endDate);
                        
                    htmlString += `
                        <div class="timeline-item org-node">
                            <div class="time-date">${dateDisplay}</div>
                            <div class="time-content">
                                <div class="org-title">${org.organization}</div>
                                <div class="role-title">${role.title}</div>
                                <div class="role-desc">${role.shortDescription || ''}</div>
                            </div>
                        </div>
                    `;
                }
            });
            container.innerHTML = htmlString;

        } catch (error) {
            container.innerHTML = `<p style="color: #d73a49; font-family: monospace; padding: 20px;">⚠️ Error loading timeline: ${error.message}</p>`;
            console.error("Timeline Error:", error);
        }
    }

    // ==========================================
    // 9. RENDER ACHIEVEMENTS
    // ==========================================
    async function renderAchievements() {
        const container = document.getElementById('achievements-container');
        if (!container) return;

        try {
            const response = await fetch('json/achievements.json');
            if (!response.ok) throw new Error("Could not find achievements.json");
            
            const data = await response.json();
            
            container.innerHTML = ''; 

            let allAchievements = [];
            for (const category in data) {
                const items = data[category].map(item => ({ ...item, categoryType: category }));
                allAchievements = allAchievements.concat(items);
            }

            const featuredAchievements = allAchievements
                .filter(item => String(item.featured) === "true")
                .slice(0, 3);

            function formatAchieveDate(dateStr) {
                if (!dateStr) return '';
                const parts = dateStr.split('-');
                if (parts.length === 2) {
                    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                    return `${months[parseInt(parts[0], 10) - 1]} '${parts[1].slice(2)}`;
                }
                return dateStr;
            }

            let htmlString = "";
            featuredAchievements.forEach(item => {
                const imgHtml = item.path 
                    ? `<img src="${item.path}" alt="${item.shortTitle}">`
                    : `<div class="bg-dark"></div>`;
                
                const dateDisplay = formatAchieveDate(item.date);
                
                let typeLabel = item.categoryType;
                if (typeLabel === 'credentials') typeLabel = 'Credential';
                if (typeLabel === 'recognition') typeLabel = 'Recognition';
                if (typeLabel === 'volunteering') typeLabel = 'Volunteering';
                if (typeLabel === 'participation') typeLabel = 'Participation';

                htmlString += `
                    <div class="achieve-card" data-img="${item.path}">
                        <h4 class="card-title">${item.shortTitle}</h4>
                        <div class="card-img-wrapper">${imgHtml}</div>
                        <p class="card-desc">${item.description || ''}</p>
                        <div class="card-footer">
                            <span class="pill ${item.categoryType}">${typeLabel}</span>
                            <span class="card-meta">${dateDisplay}</span>
                        </div>
                    </div>
                `;
            });
            
            container.innerHTML = htmlString;

        } catch (error) {
            container.innerHTML = `<p style="color: #d73a49; font-family: monospace; padding: 20px;">⚠️ Error loading achievements: ${error.message}</p>`;
            console.error("Achievements Error:", error);
        }
    }

    // ==========================================
    // 10. RENDER CREATIVE
    // ==========================================
    async function renderCreative() {
        const container = document.getElementById('creative-container');
        if (!container) return;

        try {
            const response = await fetch('json/creative.json');
            if (!response.ok) throw new Error("Could not find creative.json");
            
            const data = await response.json();
            const creatives = Array.isArray(data) ? data : (data.creative || Object.values(data)[0]);
            
            if (!Array.isArray(creatives)) throw new Error("JSON data is not properly formatted as an array.");

            container.innerHTML = ''; 

            const featuredCreative = creatives
                .filter(item => String(item.featured) === "true")
                .slice(0, 3);

            let htmlString = "";
            featuredCreative.forEach(item => {
                const imgHtml = item.image 
                    ? `<img src="${item.image}" alt="${item.title}">`
                    : `<div class="bg-dark"></div>`;
                
                htmlString += `
                    <div class="creative-card" data-img="${item.image}">
                        <h4 class="card-title">${item.title}</h4>
                        <div class="card-img-wrapper">${imgHtml}</div>
                        <p class="card-desc">${item.description}</p>
                    </div>
                `;
            });
            
            container.innerHTML = htmlString;

        } catch (error) {
            container.innerHTML = `<p style="color: #d73a49; font-family: monospace; padding: 20px;">⚠️ Error loading creative: ${error.message}</p>`;
            console.error("Creative Error:", error);
        }
    }

    // ==========================================
    // 11. RENDER FULL WORKS LIST (works.html)
    // ==========================================
    async function renderFullWorks() {
        try {
            const response = await fetch('json/works.json');
            const works = await response.json();
            const container = document.getElementById('works-full-container');
            
            if (!container) return;
            container.innerHTML = ''; 
            
            works.forEach(work => {
                const pillClass = work.type === 'RESEARCH' ? 'research' : 'project';
                
                const imageWrapperHtml = work.image 
                    ? `<div class="work-list-img-wrapper"><img src="${work.image}" alt="${work.shortTitle}"></div>`
                    : '';
                    
                const linkStart = work.link ? `<a href="${work.link}" target="_blank" class="work-list-visuals">` : `<div class="work-list-visuals">`;
                const linkEnd = work.link ? `</a>` : `</div>`;
                    
                const item = `
                    <div class="work-list-item">
                        <div class="work-list-content">
                            <h3 class="work-list-title">${work.title}</h3>
                            <p class="work-list-desc">
                                <span class="work-year">[${work.year}]</span> ${work.description}
                            </p>
                            <div class="work-list-footer">
                                <span class="pill ${pillClass}">${work.type}</span>
                                <span class="work-list-tags">${work.tags.join(' &middot; ')}</span>
                            </div>
                        </div>
                        ${linkStart}
                            ${imageWrapperHtml}
                            <span class="arrow">
                                <svg class="arrow-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><path d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z"></path></svg>
                            </span>
                        ${linkEnd}
                    </div>
                `;
                container.innerHTML += item;
            });
        } catch (error) {
            console.error("Error loading full works list:", error);
        }
    }

    // ==========================================
    // 12. RENDER FULL EXPERIENCE LIST (experience.html)
    // ==========================================
    async function renderFullExperience() {
        const container = document.getElementById('experience-full-container');
        if (!container) return;

        try {
            const response = await fetch('json/experiences.json');
            if (!response.ok) throw new Error("Could not find experiences.json");
            
            const data = await response.json();
            container.innerHTML = ''; 

            function formatTimelineDate(dateStr) {
                if (!dateStr) return '';
                if (dateStr.length === 4) return dateStr; 
                
                const parts = dateStr.split('-');
                if (parts.length === 2) {
                    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                    return `${months[parseInt(parts[1], 10) - 1]} '${parts[0].slice(2)}`;
                }
                return dateStr; 
            }
            
            let htmlString = "";
            data.forEach(org => {
                const roles = org.roles;
                if (!roles || roles.length === 0) return;

                if (roles.length > 1) {
                    // Org Node
                    htmlString += `
                        <div class="timeline-item org-node">
                            <div class="time-date"></div>
                            <div class="time-content">
                                <div class="org-title">${org.organization}</div>
                                <div class="exp-meta-loc">${org.location || ''}</div>
                            </div>
                        </div>
                    `;
                    // Role Nodes
                    roles.forEach(role => {
                        const dateDisplay = role.startDate 
                            ? `${formatTimelineDate(role.startDate)} - ${formatTimelineDate(role.endDate)}` 
                            : formatTimelineDate(role.endDate);
                        
                        const pillClass = role.type ? role.type.toLowerCase() : 'education';
                        
                        let descHtml = "";
                        if (Array.isArray(role.description)) {
                            if (role.description.length === 1) {
                                descHtml = `<p class="exp-desc">${role.description[0]}</p>`;
                            } else if (role.description.length > 1) {
                                descHtml = `<ul class="exp-bullets">` + 
                                    role.description.map(desc => `<li>${desc}</li>`).join('') + 
                                    `</ul>`;
                            }
                        }
                            
                        htmlString += `
                            <div class="timeline-item role-node">
                                <div class="time-date">${dateDisplay}</div>
                                <div class="time-content">
                                    <div class="role-header">
                                        <span class="pill ${pillClass}">${role.type}</span>
                                        <span class="role-title-full">${role.title}</span>
                                    </div>
                                    ${descHtml}
                                </div>
                            </div>
                        `;
                    });
                } else {
                    // Combined Node
                    const role = roles[0];
                    const dateDisplay = role.startDate 
                        ? `${formatTimelineDate(role.startDate)} - ${formatTimelineDate(role.endDate)}` 
                        : formatTimelineDate(role.endDate);
                    
                    const pillClass = role.type ? role.type.toLowerCase() : 'education';
                    
                    let descHtml = "";
                    if (Array.isArray(role.description)) {
                        if (role.description.length === 1) {
                            descHtml = `<p class="exp-desc">${role.description[0]}</p>`;
                        } else if (role.description.length > 1) {
                            descHtml = `<ul class="exp-bullets">` + 
                                role.description.map(desc => `<li>${desc}</li>`).join('') + 
                                `</ul>`;
                        }
                    }
                        
                    htmlString += `
                        <div class="timeline-item org-node">
                            <div class="time-date">${dateDisplay}</div>
                            <div class="time-content">
                                <div class="org-title">${org.organization}</div>
                                <div class="exp-meta-loc">${org.location || ''}</div>
                                <div class="role-header">
                                    <span class="pill ${pillClass}">${role.type}</span>
                                    <span class="role-title-full">${role.title}</span>
                                </div>
                                ${descHtml}
                            </div>
                        </div>
                    `;
                }
            });
            container.innerHTML = htmlString;

        } catch (error) {
            container.innerHTML = `<p style="color: #d73a49; font-family: monospace; padding: 20px;">⚠️ Error loading timeline: ${error.message}</p>`;
            console.error("Timeline Error:", error);
        }
    }

    // ==========================================
    // 13. RENDER ACHIEVEMENTS PAGE (achievements.html)
    // ==========================================
    
    // Helper to parse dates for accurate sorting
    function parseAchieveDate(dateStr) {
        if (!dateStr) return new Date(0);
        let parts = dateStr.split('-');
        if (parts.length === 2) return new Date(parts[1], parseInt(parts[0]) - 1);
        return new Date(parts[0], 0);
    }

    async function renderAchieveRecent() {
        const container = document.getElementById('achieve-recent-container');
        if (!container) return;

        try {
            const response = await fetch('json/achievements.json');
            const data = await response.json();
            container.innerHTML = ''; 

            let allItems = [];
            for (const category in data) {
                allItems = allItems.concat(data[category].map(item => ({ ...item, categoryType: category })));
            }

            // Sort by Date Descending, take top 3
            allItems.sort((a, b) => parseAchieveDate(b.date) - parseAchieveDate(a.date));
            const recentItems = allItems.slice(0, 3);

            let htmlString = "";
            recentItems.forEach(item => {
                const imgHtml = item.path ? `<img src="${item.path}" alt="${item.shortTitle}">` : `<div class="bg-dark"></div>`;
                
                let typeLabel = item.categoryType;
                if (typeLabel === 'credentials') typeLabel = 'Credential';
                if (typeLabel === 'recognition') typeLabel = 'Recognition';
                if (typeLabel === 'volunteering') typeLabel = 'Volunteering';
                if (typeLabel === 'participation') typeLabel = 'Participation';

                // Pills are kept here, just like index page
                htmlString += `
                    <div class="achieve-card" data-img="${item.path}">
                        <h4 class="card-title">${item.shortTitle}</h4>
                        <div class="card-img-wrapper">${imgHtml}</div>
                        <p class="card-desc">${item.description || ''}</p>
                        <div class="card-footer">
                            <span class="pill ${item.categoryType}">${typeLabel}</span>
                            <span class="card-meta">${item.date}</span>
                        </div>
                    </div>
                `;
            });
            container.innerHTML = htmlString;
        } catch (error) {
            console.error("Error loading recent achievements:", error);
        }
    }

    async function renderAchieveCategory(categoryKey, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        try {
            const response = await fetch('json/achievements.json');
            const data = await response.json();
            container.innerHTML = ''; 

            const items = data[categoryKey] || [];
            
            let htmlString = "";
            items.forEach(item => {
                const imgHtml = item.path ? `<img src="${item.path}" alt="${item.shortTitle}">` : `<div class="bg-dark"></div>`;
                
                // NO pills here. Date bracket + Description.
                htmlString += `
                    <div class="achieve-card" data-img="${item.path}">
                        <h4 class="card-title">${item.shortTitle}</h4>
                        <div class="card-img-wrapper">${imgHtml}</div>
                        <p class="card-desc">
                            <span class="date-bracket">[${item.date}]</span> ${item.description || ''}
                        </p>
                    </div>
                `;
            });
            container.innerHTML = htmlString;
        } catch (error) {
            console.error(`Error loading achievements for ${categoryKey}:`, error);
        }
    }

    // ==========================================
    // 14. IMAGE POPUP MODAL LOGIC
    // ==========================================
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-img');
    const closeBtn = document.querySelector('.modal-close');

    if (modal) {
        // Event delegation to catch clicks on any dynamically loaded .achieve-card
        document.body.addEventListener('click', (e) => {
        const card = e.target.closest('.achieve-card, .creative-card');
            if (card) {
                const imgSrc = card.getAttribute('data-img');
                if (imgSrc && imgSrc !== 'null' && imgSrc !== 'undefined') {
                    modalImg.src = imgSrc;
                    modal.classList.add('active');
                }
            }
        });
        
        // Close when X is clicked
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modal.classList.remove('active');
            });
        }
        
        // Close when clicking outside the image
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    }

    // ==========================================
    // 15. RENDER FULL CREATIVE PAGE (creative.html)
    // ==========================================
    async function renderFullCreative() {
        const container = document.getElementById('creative-full-container');
        if (!container) return;

        try {
            const response = await fetch('json/creative.json');
            if (!response.ok) throw new Error("Could not find creative.json");
            
            const data = await response.json();
            const creatives = Array.isArray(data) ? data : (data.creative || Object.values(data)[0]);
            
            if (!Array.isArray(creatives)) throw new Error("JSON data is not properly formatted as an array.");

            container.innerHTML = ''; 

            let htmlString = "";
            creatives.forEach(item => {
                const imgHtml = item.image 
                    ? `<img src="${item.image}" alt="${item.title}">`
                    : `<div class="bg-dark"></div>`;
                
                htmlString += `
                    <div class="creative-card" data-img="${item.image}">
                        <h4 class="card-title">${item.title}</h4>
                        <div class="card-img-wrapper">${imgHtml}</div>
                        <p class="card-desc">${item.description}</p>
                    </div>
                `;
            });
            
            container.innerHTML = htmlString;

        } catch (error) {
            container.innerHTML = `<p style="color: #d73a49; font-family: monospace; padding: 20px;">⚠️ Error loading creative: ${error.message}</p>`;
            console.error("Creative Error:", error);
        }
    }

    // ==========================================
    // 16. SHARE BUTTON (COPY TO CLIPBOARD)
    // ==========================================
    const shareIcons = document.querySelectorAll('.share-icon');
    
    shareIcons.forEach(icon => {
        icon.addEventListener('click', () => {
            // Get the current live URL
            const currentUrl = window.location.href;
            
            navigator.clipboard.writeText(currentUrl).then(() => {
                // Briefly flash the icon to the accent color
                icon.style.transition = "fill 0.2s";
                icon.style.fill = "var(--accent-dark)";
                
                // Create a sleek "toast" notification
                const toast = document.createElement('div');
                toast.textContent = "Link copied to clipboard!";
                toast.style.position = 'fixed';
                toast.style.top = '75px';
                toast.style.right = '24px';
                toast.style.backgroundColor = 'var(--accent-dark)';
                toast.style.color = '#ffffff';
                toast.style.padding = '8px 16px';
                toast.style.borderRadius = '6px';
                toast.style.fontFamily = 'var(--font-mono)';
                toast.style.fontSize = '0.85rem';
                toast.style.fontWeight = 'bold';
                toast.style.zIndex = '3000';
                toast.style.opacity = '0';
                toast.style.transform = 'translateY(-10px)';
                toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                toast.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                
                document.body.appendChild(toast);
                
                // Trigger the fade-in & slide-down animation
                requestAnimationFrame(() => {
                    toast.style.opacity = '1';
                    toast.style.transform = 'translateY(0)';
                });
                
                // Remove the toast and reset the icon after 2 seconds
                setTimeout(() => {
                    toast.style.opacity = '0';
                    toast.style.transform = 'translateY(-10px)';
                    icon.style.fill = ""; // Reverts to CSS default
                    setTimeout(() => toast.remove(), 300);
                }, 2000);
                
            }).catch(err => {
                console.error("Could not copy text: ", err);
            });
        });
    });
});