let descendantMetadata = [];
let moduleMetadata = [];
let weaponMetadata = [];
let reactorMetadata = [];
let externalcomponentMetadata = [];
let statMetadata = [];
fetch('https://open.api.nexon.com/static/tfd/meta/fr/descendant.json')
    .then(response => response.json())
    .then(data => {
        descendantMetadata = data;
    })
    .catch(error => {
        console.error('Erreur lors du chargement des métadonnées des descendants:', error);
    });
fetch('https://open.api.nexon.com/static/tfd/meta/fr/module.json')
    .then(response => response.json())
    .then(data => {
        moduleMetadata = data;
    })
    .catch(error => {
        console.error('Erreur lors du chargement des métadonnées des modules:', error);
    });
fetch('https://open.api.nexon.com/static/tfd/meta/fr/weapon.json')
    .then(response => response.json())
    .then(data => {
        weaponMetadata = data;
    })
    .catch(error => {
        console.error('Erreur lors du chargement des métadonnées des armes:', error);
    });
fetch('https://open.api.nexon.com/static/tfd/meta/fr/reactor.json')
    .then(response => response.json())
    .then(data => {
        reactorMetadata = data;
    })
    .catch(error => {
        console.error('Erreur lors du chargement des métadonnées des réacteurs:', error);
    });
fetch('https://open.api.nexon.com/static/tfd/meta/fr/external-component.json')
    .then(response => response.json())
    .then(data => {
        externalcomponentMetadata = data;
    })
    .catch(error => {
        console.error('Erreur lors du chargement des métadonnées des composants externe:', error);
    });
fetch('https://open.api.nexon.com/static/tfd/meta/fr/stat.json')
    .then(response => response.json())
    .then(data => {
        statMetadata = data;
    })
    .catch(error => {
        console.error('Erreur lors du chargement des métadonnées des stats:', error);
    });

document.getElementById('playerForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const playerName = document.getElementById('playerName').value;

    fetchPlayerId(playerName);
});

function fetchPlayerId(playerName) {
    const apiKey = 'test_c8134b23f6fe670e0a610bfa21f740f6950d10496ce88515b9a1c7fa2aded2efefe8d04e6d233bd35cf2fabdeb93fb0d';
    const url = `https://open.api.nexon.com/tfd/v1/id?user_name=${encodeURIComponent(playerName)}`;

    fetch(url, {
        method: 'GET',
        headers: {
            'x-nxopen-api-key': apiKey
        }
    })
        .then(response => response.json())
        .then(data => {
            if (data && data.ouid) {
                fetchPlayerInfo(data.ouid);
            } else {
                document.getElementById('playerInfo').innerText = 'Joueur non trouvé.';
            }
        })
        .catch(error => {
            console.error('Erreur:', error);
            document.getElementById('playerInfo').innerText = 'Erreur lors de la récupération de l\'ID du joueur.';
        });
}

function fetchPlayerInfo(ouid) {
    const apiKey = 'test_c8134b23f6fe670e0a610bfa21f740f6950d10496ce88515b9a1c7fa2aded2efefe8d04e6d233bd35cf2fabdeb93fb0d';
    const basicInfoUrl = `https://open.api.nexon.com/tfd/v1/user/basic?ouid=${ouid}`;
    const descendantInfoUrl = `https://open.api.nexon.com/tfd/v1/user/descendant?ouid=${ouid}`;
    const reactorInfoUrl = `https://open.api.nexon.com/tfd/v1/user/reactor?language_code=fr&ouid=${ouid}`;
    const externalcomponentInfoUrl = `https://open.api.nexon.com/tfd/v1/user/external-component?language_code=fr&ouid=${ouid}`;
    const weaponUrl = `https://open.api.nexon.com/tfd/v1/user/weapon?language_code=fr&ouid=${ouid}`;

    Promise.all([
        fetch(basicInfoUrl, {
            method: 'GET',
            headers: {
                'x-nxopen-api-key': apiKey
            }
        }).then(response => response.json()),
        fetch(descendantInfoUrl, {
            method: 'GET',
            headers: {
                'x-nxopen-api-key': apiKey
            }
        }).then(response => response.json()),
        fetch(reactorInfoUrl, {
            method: 'GET',
            headers: {
                'x-nxopen-api-key': apiKey
            }
        }).then(response => response.json()),
        fetch(externalcomponentInfoUrl, {
            method: 'GET',
            headers: {
                'x-nxopen-api-key': apiKey
            }
        }).then(response => response.json()),
        fetch(weaponUrl, {
            method: 'GET',
            headers: {
                'x-nxopen-api-key': apiKey
            }
        }).then(response => response.json())
    ])
        .then(results => {
            const basicInfo = results[0];
            const descendantInfo = results[1];
            const reactorInfo = results[2];
            const externalcomponentInfo = results[3];
            const weaponInfo = results[4];
            displayPlayerInfo(basicInfo, descendantInfo);
            displayModules(descendantInfo.module || []);
            displayReactor(reactorInfo, externalcomponentInfo.external_component || []);
            displayWeapon(weaponInfo.weapon || []);
        })
        .catch(error => {
            console.error('Erreur:', error);
            document.getElementById('playerInfo').innerText = 'Erreur lors de la récupération des informations du joueur.';
        });
}

function displayPlayerInfo(basicInfo, descendantInfo) {
    const playerInfoDiv = document.getElementById('playerInfo');
    const descendantMeta = descendantMetadata.find(meta => meta.descendant_id === descendantInfo.descendant_id);
    const descendantName = descendantMeta ? descendantMeta.descendant_name : 'Nom inconnu';
    const descendantImg = descendantMeta ? descendantMeta.descendant_image_url : '';

    playerInfoDiv.innerHTML = `
                <div class="card mb-4">
                  <div class="card-body">
                    <h2 class="card-title">Niveau de maîtrise: ${basicInfo.mastery_rank_level}</h2>
                    <h2 class="card-title">Descendant actuel:</h2>
                    <p>${descendantName}</p>
                    <p><img src='${descendantImg}' alt='Image de ${descendantName}' class="img-fluid" width="200px" height="auto"/></p>
                    <p><strong>Niveau:</strong> ${descendantInfo.descendant_level}</p>
                    <p><strong>Capacité de modules:</strong> ${descendantInfo.module_capacity}/${descendantInfo.module_max_capacity}</p>
                  </div>
                </div>

            `;
}
function displayModules(modules) {
    const modulesContainer = document.getElementById('modulesContainer');

    const modulesHtml = modules.map(module => {
        const moduleMeta = moduleMetadata.find(meta => meta.module_id === module.module_id);
        const moduleName = moduleMeta ? moduleMeta.module_name : 'Nom inconnu';
        const moduleImageUrl = moduleMeta ? moduleMeta.image_url : '';
        const moduleStat = moduleMeta && moduleMeta.module_stat ? moduleMeta.module_stat.find(stat => stat.level === module.module_enchant_level) : {};
        const moduleDescription = moduleStat ? moduleStat.value : 'Description non disponible';
        const moduleCost = moduleStat ? moduleStat.module_capacity : "-";

        let moduleTierClass = '';
        switch (moduleMeta.module_tier) {
            case 'Normal':
                moduleTierClass = 'blue';
                break;
            case 'Rare':
                moduleTierClass = 'purple';
                break;
            case 'Ultime':
                moduleTierClass = 'yellow';
                break;
            case 'Transcendant':
                moduleTierClass = 'red';
                break;
            default:
                moduleTierClass = '';
        }
        let moduleType = moduleMeta.module_type === null ? '-' : moduleMeta.module_type;

        return `
        <div class="moduleCard" onmouseover="showDescription(event)" onmouseout="hideDescription(event)">
        <div class="CardModuleInfo">
            <div class="socketBanner">
                <img width="20" height="20" src="./img/${moduleMeta.module_socket_type}.png">
                <span>${moduleCost}</span>
            </div>
            <div class="moduleImg ${moduleTierClass}">
                <img width="80" height="80" alt="${moduleName}"
                     src="${moduleImageUrl}">
            </div>
            <div class="moduleName">
                <p>${moduleName}</p>
            </div>
        </div>
        <div class="CardModuleType">
            <p>${moduleType}</p>
        </div>
        <div class="moduleDescription">${moduleDescription}</div>
    </div>
                `;
    }).join('');

    modulesContainer.innerHTML = modulesHtml;
}
function displayReactor(reactorInfo, external_components) {
    const reactorInfoDiv = document.getElementById('reactorInfo');
    const reactorMeta = reactorMetadata.find(meta => meta.reactor_id === reactorInfo.reactor_id);
    const reactorName = reactorMeta ? reactorMeta.reactor_name : 'Nom inconnu';
    const reactorImg = reactorMeta ? reactorMeta.image_url : '';
    const reactorCondition = reactorMeta ? reactorMeta.optimized_condition_type : '';
    let substatsHTML = '';
    const reactorLvl = reactorMeta && reactorMeta.reactor_skill_power ? reactorMeta.reactor_skill_power.find(stat => stat.level === reactorInfo.reactor_level) : {};
    if (reactorLvl && reactorLvl.skill_power_coefficient) {
        reactorLvl.skill_power_coefficient.forEach(stat => {
            substatsHTML += `<p>${stat.coefficient_stat_id}: x${stat.coefficient_stat_value}</p>`;
        });
    }
    let additionalStatsHTML = '';
    reactorInfo.reactor_additional_stat.forEach(stat => {
        additionalStatsHTML += `<p>${stat.additional_stat_name}: ${stat.additional_stat_value}</p>`;
    });

    let externalComponentsHTML = '';
    external_components.forEach(external_component => {
        const componentMeta = externalcomponentMetadata.find(meta => meta.external_component_id === external_component.external_component_id);
        const componentName = componentMeta ? componentMeta.external_component_name : 'Nom inconnu';
        const componentImg = componentMeta ? componentMeta.image_url : '';
        let mainstatcomponentHTML = '';
        let additionalcomponentStatsHTML = '';
        const componentLvl = componentMeta && componentMeta.base_stat ? componentMeta.base_stat.find(stat => stat.level === external_component.external_component_level) : {};
        if (componentLvl && componentLvl.stat_id) {
            const statMeta = statMetadata.find(meta => meta.stat_id === componentLvl.stat_id);
            const statName = statMeta ? statMeta.stat_name : componentLvl.stat_id;
            mainstatcomponentHTML += `<p>${statName}: ${componentLvl.stat_value}</p>`;
            external_component.external_component_additional_stat.forEach(stat => {
                additionalcomponentStatsHTML += `<p>${stat.additional_stat_name}: ${stat.additional_stat_value}</p>`;
            });
        }



        externalComponentsHTML += `
      <div class="external-component">
        <h3 class="external-component-title">${componentName}(lv.${external_component.external_component_level})</h3>
        <p><img src="${componentImg}" class="external-component-img"></p>
        ${mainstatcomponentHTML}
        ${additionalcomponentStatsHTML}
      </div>
    `;
    });

    reactorInfoDiv.innerHTML = `
                <div class="card mb-4">
                  <div class="card-body d-flex">
                    <div class="reactor-info">
                    <h2 class="card-title">${reactorName}(lv.${reactorInfo.reactor_level})</h2>
                    <p><img src="${reactorImg}"></p>
                    <p>${reactorCondition}</p>
                    ${substatsHTML}
                    ${additionalStatsHTML}
                    <p>Niveau d'amélioration: ${reactorInfo.reactor_enchant_level}</p>
                    </div>
                    <div class="external-components d-flex flex-wrap">
                    ${externalComponentsHTML}
                  </div>
                  </div>
                </div>

            `;
}


function displayWeapon(weapons) {
    const weaponInfoDiv = document.getElementById('weaponInfo');
    let weaponsHTML = '';
    weapons.forEach(weapon => {
        const weaponMeta = weaponMetadata.find(meta => meta.weapon_id === weapon.weapon_id);
        const weaponName = weaponMeta ? weaponMeta.weapon_name : 'Nom inconnu';
        const weaponImg = weaponMeta ? weaponMeta.image_url : '';
        const weaponModules = weapon.module || [];
        let weaponStatsHTML = '';
        weapon.weapon_additional_stat.forEach(stat => {
            weaponStatsHTML += `<p>${stat.additional_stat_name}: ${stat.additional_stat_value}</p>`;
        });

        let modulesHTML = '';
        weaponModules.forEach(module => {
            const moduleMeta = moduleMetadata.find(meta => meta.module_id === module.module_id);
            const moduleName = moduleMeta ? moduleMeta.module_name : 'Nom inconnu';
            const moduleImageUrl = moduleMeta ? moduleMeta.image_url : '';
            const moduleStat = moduleMeta && moduleMeta.module_stat ? moduleMeta.module_stat.find(stat => stat.level === module.module_enchant_level) : {};
            const moduleDescription = moduleStat ? moduleStat.value : 'Description non disponible';
            const moduleSocketType = moduleMeta ? moduleMeta.module_socket_type : 'Inconnu';
            const moduleCost = moduleStat ? moduleStat.module_capacity : '-';

            let moduleTierClass = '';
            switch (moduleMeta.module_tier) {
                case 'Normal':
                    moduleTierClass = 'blue';
                    break;
                case 'Rare':
                    moduleTierClass = 'purple';
                    break;
                case 'Ultime':
                    moduleTierClass = 'yellow';
                    break;
                case 'Transcendant':
                    moduleTierClass = 'red';
                    break;
                default:
                    moduleTierClass = '';
            }

            modulesHTML += `
                <div class="moduleCard">
                    <div class="CardModuleInfo">
                        <div class="socketBanner">
                            <img width="20" height="20" src="./img/${moduleSocketType}.png">
                            <span>${moduleCost}</span>
                        </div>
                        <div class="moduleImg ${moduleTierClass}">
                            <img width="80" height="80" alt="${moduleName}" src="${moduleImageUrl}">
                        </div>
                        <div class="moduleName">
                            <p>${moduleName}</p>
                        </div>
                    </div>
                    <div class="CardModuleType">
                        <p>${moduleMeta.module_type || '-'}</p>
                    </div>
                    <div class="moduleDescription">${moduleDescription}</div>
                </div>
            `;
        });


        weaponsHTML += `
      <div class="weapon-container">
                <div class="weapon">
                    <h3 class="weapon-title">${weaponName}(lv.${weapon.weapon_level})</h3>
                    <p><img src="${weaponImg}" class="weapon-img"></p>
                    ${weaponStatsHTML}
                </div>
                <div class="weapon-modules">
                    ${modulesHTML}
                </div>
            </div>
    `;
    });
    weaponInfoDiv.innerHTML = weaponsHTML;
}


function showDescription(event) {
    const moduleCard = event.currentTarget;
    const description = moduleCard.querySelector('.moduleDescription');
    description.style.width = '300px';
    const rect = moduleCard.getBoundingClientRect();
    const descriptionRect = description.getBoundingClientRect();


    if (rect.right + descriptionRect.width > window.innerWidth) {
        description.style.left = 'auto';
        description.style.right = '100%';
        description.style.marginRight = '10px';
    } else {
        description.style.left = '100%';
        description.style.right = 'auto';
        description.style.marginLeft = '10px';
    }
    description.style.visibility = 'visible';
    description.style.opacity = '1';
}

function hideDescription(event) {
    const moduleCard = event.currentTarget;
    const description = moduleCard.querySelector('.moduleDescription');
    description.style.left = '100%';
    description.style.right = 'auto';
    description.style.marginLeft = '10px';
    description.style.marginRight = '0';
    description.style.visibility = 'hidden';
    description.style.opacity = '0';
}