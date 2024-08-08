let descendantMetadata=[],moduleMetadata=[],weaponMetadata=[],reactorMetadata=[],externalcomponentMetadata=[],statMetadata=[];function fetchPlayerId(e){let t=`https://open.api.nexon.com/tfd/v1/id?user_name=${encodeURIComponent(e)}`;fetch(t,{method:"GET",headers:{"x-nxopen-api-key":"test_c8134b23f6fe670e0a610bfa21f740f6950d10496ce88515b9a1c7fa2aded2efefe8d04e6d233bd35cf2fabdeb93fb0d"}}).then(e=>e.json()).then(e=>{e&&e.ouid?fetchPlayerInfo(e.ouid):document.getElementById("playerInfo").innerText="Joueur non trouv\xe9."}).catch(e=>{console.error("Erreur:",e),document.getElementById("playerInfo").innerText="Erreur lors de la r\xe9cup\xe9ration de l'ID du joueur."})}function fetchPlayerInfo(e){let t="test_c8134b23f6fe670e0a610bfa21f740f6950d10496ce88515b9a1c7fa2aded2efefe8d04e6d233bd35cf2fabdeb93fb0d",a=`https://open.api.nexon.com/tfd/v1/user/basic?ouid=${e}`,n=`https://open.api.nexon.com/tfd/v1/user/descendant?ouid=${e}`,o=`https://open.api.nexon.com/tfd/v1/user/reactor?language_code=fr&ouid=${e}`,d=`https://open.api.nexon.com/tfd/v1/user/external-component?language_code=fr&ouid=${e}`,i=`https://open.api.nexon.com/tfd/v1/user/weapon?language_code=fr&ouid=${e}`;Promise.all([fetch(a,{method:"GET",headers:{"x-nxopen-api-key":t}}).then(e=>e.json()),fetch(n,{method:"GET",headers:{"x-nxopen-api-key":t}}).then(e=>e.json()),fetch(o,{method:"GET",headers:{"x-nxopen-api-key":t}}).then(e=>e.json()),fetch(d,{method:"GET",headers:{"x-nxopen-api-key":t}}).then(e=>e.json()),fetch(i,{method:"GET",headers:{"x-nxopen-api-key":t}}).then(e=>e.json())]).then(e=>{let t=e[0],a=e[1],n=e[2],o=e[3],d=e[4];displayPlayerInfo(t,a),displayModules(a.module||[]),displayReactor(n,o.external_component||[]),displayWeapon(d.weapon||[])}).catch(e=>{console.error("Erreur:",e),document.getElementById("playerInfo").innerText="Erreur lors de la r\xe9cup\xe9ration des informations du joueur."})}function displayPlayerInfo(e,t){let a=document.getElementById("playerInfo"),n=descendantMetadata.find(e=>e.descendant_id===t.descendant_id),o=n?n.descendant_name:"Nom inconnu",d=n?n.descendant_image_url:"";a.innerHTML=`
                <div class="card mb-4">
                  <div class="card-body">
                    <h2 class="card-title">Niveau de ma\xeetrise: ${e.mastery_rank_level}</h2>
                    <h2 class="card-title">Descendant actuel:</h2>
                    <p>${o}</p>
                    <p><img src='${d}' alt='Image de ${o}' class="img-fluid" width="200px" height="auto"/></p>
                    <p><strong>Niveau:</strong> ${t.descendant_level}</p>
                    <p><strong>Capacit\xe9 de modules:</strong> ${t.module_capacity}/${t.module_max_capacity}</p>
                  </div>
                </div>

            `}function displayModules(e){let t=document.getElementById("modulesContainer"),a=e.map(e=>{let t=moduleMetadata.find(t=>t.module_id===e.module_id),a=t?t.module_name:"Nom inconnu",n=t?t.image_url:"",o=t&&t.module_stat?t.module_stat.find(t=>t.level===e.module_enchant_level):{},d=o?o.value:"Description non disponible",i=o?o.module_capacity:"-",s="";switch(t.module_tier){case"Normal":s="blue";break;case"Rare":s="purple";break;case"Ultime":s="yellow";break;case"Transcendant":s="red";break;default:s=""}return`
        <div class="moduleCard" onmouseover="showDescription(event)" onmouseout="hideDescription(event)">
        <div class="CardModuleInfo">
            <div class="socketBanner">
                <img width="20" height="20" src="./img/${t.module_socket_type}.png">
                <span>${i}</span>
            </div>
            <div class="moduleImg ${s}">
                <img width="80" height="80" alt="${a}"
                     src="${n}">
            </div>
            <div class="moduleName">
                <p>${a}</p>
            </div>
        </div>
        <div class="CardModuleType">
            <p>${null===t.module_type?"-":t.module_type}</p>
        </div>
        <div class="moduleDescription">${d}</div>
    </div>
                `}).join("");t.innerHTML=a}function displayReactor(e,t){let a=document.getElementById("reactorInfo"),n=reactorMetadata.find(t=>t.reactor_id===e.reactor_id),o=n?n.reactor_name:"Nom inconnu",d=n?n.image_url:"",i=n?n.optimized_condition_type:"",s="",l=n&&n.reactor_skill_power?n.reactor_skill_power.find(t=>t.level===e.reactor_level):{};l&&l.skill_power_coefficient&&l.skill_power_coefficient.forEach(e=>{s+=`<p>${e.coefficient_stat_id}: x${e.coefficient_stat_value}</p>`});let r="";e.reactor_additional_stat.forEach(e=>{r+=`<p>${e.additional_stat_name}: ${e.additional_stat_value}</p>`});let c="";t.forEach(e=>{let t=externalcomponentMetadata.find(t=>t.external_component_id===e.external_component_id),a=t?t.external_component_name:"Nom inconnu",n=t?t.image_url:"",o="",d="",i=t&&t.base_stat?t.base_stat.find(t=>t.level===e.external_component_level):{};if(i&&i.stat_id){let s=statMetadata.find(e=>e.stat_id===i.stat_id),l=s?s.stat_name:i.stat_id;o+=`<p>${l}: ${i.stat_value}</p>`,e.external_component_additional_stat.forEach(e=>{d+=`<p>${e.additional_stat_name}: ${e.additional_stat_value}</p>`})}c+=`
      <div class="external-component">
        <h3 class="external-component-title">${a}(lv.${e.external_component_level})</h3>
        <p><img src="${n}" class="external-component-img"></p>
        ${o}
        ${d}
      </div>
    `}),a.innerHTML=`
                <div class="card mb-4">
                  <div class="card-body d-flex">
                    <div class="reactor-info">
                    <h2 class="card-title">${o}(lv.${e.reactor_level})</h2>
                    <p><img src="${d}"></p>
                    <p>${i}</p>
                    ${s}
                    ${r}
                    <p>Niveau d'am\xe9lioration: ${e.reactor_enchant_level}</p>
                    </div>
                    <div class="external-components d-flex flex-wrap">
                    ${c}
                  </div>
                  </div>
                </div>

            `}function displayWeapon(e){let t=document.getElementById("weaponInfo"),a="";e.forEach(e=>{let t=weaponMetadata.find(t=>t.weapon_id===e.weapon_id),n=t?t.weapon_name:"Nom inconnu",o=t?t.image_url:"",d=e.module||[],i="";e.weapon_additional_stat.forEach(e=>{i+=`<p>${e.additional_stat_name}: ${e.additional_stat_value}</p>`});let s="";d.forEach(e=>{let t=moduleMetadata.find(t=>t.module_id===e.module_id),a=t?t.module_name:"Nom inconnu",n=t?t.image_url:"",o=t&&t.module_stat?t.module_stat.find(t=>t.level===e.module_enchant_level):{},d=o?o.value:"Description non disponible",i=t?t.module_socket_type:"Inconnu",l=o?o.module_capacity:"-",r="";switch(t.module_tier){case"Normal":r="blue";break;case"Rare":r="purple";break;case"Ultime":r="yellow";break;case"Transcendant":r="red";break;default:r=""}s+=`
                <div class="moduleCard" onmouseover="showDescription(event)" onmouseout="hideDescription(event)">
                    <div class="CardModuleInfo">
                        <div class="socketBanner">
                            <img width="20" height="20" src="./img/${i}.png">
                            <span>${l}</span>
                        </div>
                        <div class="moduleImg ${r}">
                            <img width="80" height="80" alt="${a}" src="${n}">
                        </div>
                        <div class="moduleName">
                            <p>${a}</p>
                        </div>
                    </div>
                    <div class="CardModuleType">
                        <p>${t.module_type||"-"}</p>
                    </div>
                    <div class="moduleDescription">${d}</div>
                </div>
            `}),a+=`
      <div class="weapon-container">
                <div class="weapon">
                    <h3 class="weapon-title">${n}(lv.${e.weapon_level})</h3>
                    <p><img src="${o}" class="weapon-img"></p>
                    ${i}
                </div>
                <div class="weapon-modules">
                    ${s}
                </div>
            </div>
    `}),t.innerHTML=a}function showDescription(e){let t=e.currentTarget,a=t.querySelector(".moduleDescription");a.style.width="300px";let n=t.getBoundingClientRect(),o=a.getBoundingClientRect();n.right+o.width>window.innerWidth?(a.style.left="auto",a.style.right="100%",a.style.marginRight="10px"):(a.style.left="100%",a.style.right="auto",a.style.marginLeft="10px"),a.style.visibility="visible",a.style.opacity="1"}function hideDescription(e){let t=e.currentTarget,a=t.querySelector(".moduleDescription");a.style.left="100%",a.style.right="auto",a.style.marginLeft="10px",a.style.marginRight="0",a.style.visibility="hidden",a.style.opacity="0"}fetch("https://open.api.nexon.com/static/tfd/meta/fr/descendant.json").then(e=>e.json()).then(e=>{descendantMetadata=e}).catch(e=>{console.error("Erreur lors du chargement des m\xe9tadonn\xe9es des descendants:",e)}),fetch("https://open.api.nexon.com/static/tfd/meta/fr/module.json").then(e=>e.json()).then(e=>{moduleMetadata=e}).catch(e=>{console.error("Erreur lors du chargement des m\xe9tadonn\xe9es des modules:",e)}),fetch("https://open.api.nexon.com/static/tfd/meta/fr/weapon.json").then(e=>e.json()).then(e=>{weaponMetadata=e}).catch(e=>{console.error("Erreur lors du chargement des m\xe9tadonn\xe9es des armes:",e)}),fetch("https://open.api.nexon.com/static/tfd/meta/fr/reactor.json").then(e=>e.json()).then(e=>{reactorMetadata=e}).catch(e=>{console.error("Erreur lors du chargement des m\xe9tadonn\xe9es des r\xe9acteurs:",e)}),fetch("https://open.api.nexon.com/static/tfd/meta/fr/external-component.json").then(e=>e.json()).then(e=>{externalcomponentMetadata=e}).catch(e=>{console.error("Erreur lors du chargement des m\xe9tadonn\xe9es des composants externe:",e)}),fetch("https://open.api.nexon.com/static/tfd/meta/fr/stat.json").then(e=>e.json()).then(e=>{statMetadata=e}).catch(e=>{console.error("Erreur lors du chargement des m\xe9tadonn\xe9es des stats:",e)}),document.getElementById("playerForm").addEventListener("submit",function(e){e.preventDefault();let t=document.getElementById("playerName").value;fetchPlayerId(t)});