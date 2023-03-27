async function getUsersAndProjects() {
    const usersURL = "https://api.jsonbin.io/v3/b/6070897b181177735ef528a3/2";
    const projectsURL = "https://api.jsonbin.io/v3/b/6070893e9c59a9732cb0776f";
    const [usersResponse, projectsResponse] = await Promise.all([
      fetch(usersURL),
      fetch(projectsURL),
    ]);
    const users = await usersResponse.json();
    const projects = await projectsResponse.json();
    return [users.record, projects.record];
}

function mergeUsersAndProjects(users, projects) {
    users.forEach((user) => {
      user.projects = projects.filter(
        (project) => project.user_id === user.id
      );
    });
    return users;
}

function createCardFromUser(user) {
    const card = createCard(user);
    const gridSection = document.getElementById("cardGrid");
    gridSection.appendChild(card);
}

function createCard(user) {
    const card = document.createElement("div");
    card.classList.add("card");
    card.appendChild(createUserImage());
    card.appendChild(createUserInfoContainer(user));
    return card;
}

function createUserImage() {
    const userImage = document.createElement("div");
    userImage.classList.add("userImage");
    return userImage;
}

function createUserInfoContainer(user) {
    const container = document.createElement("div");
    container.classList.add("userInfoContainer");
    container.appendChild(createElementWithText("p", user.name, "sectionHeader"));
    container.appendChild(createElementWithText("p", user.role));
    container.appendChild(createDivider());
    container.appendChild(createElementWithText("p", "Projects", "sectionHeader"));
    container.appendChild(createProjectInfoContainer(user.projects));
    return container;
}

function createProjectInfoContainer(projects) {
    const container = document.createElement("div");
    container.classList.add("projectInformationContainer");
    if (projects.length === 0) {
      container.appendChild(createElementWithText("p", "No projects created.", "projectName"));
      return container;
    }
    projects.forEach((project) => {
      container.appendChild(createProjectItem(project));
    });
    return container;
}

function createProjectItem(project) {
    const projectName = createElementWithText("p", project.name, "projectName");
    const projectLanguages = createProjectLanguages(project.languages);
    const projectItem = document.createElement("div");
    projectItem.appendChild(projectName);
    projectItem.appendChild(projectLanguages);
    return projectItem;
}

function createProjectLanguages(languages) {
    const container = document.createElement("div");
    languages.forEach((language) => {
      container.appendChild(createProjectLanguageElement(language));
    });
    container.classList.add("projectLanguageContainer");
    return container;
}

function createProjectLanguageElement(language) {
    const languageElement = createElementWithText("p", language, "language");
    const languageClass = language.toLowerCase().replace(/[^a-z]/g, '');
    languageElement.classList.add(languageClass);
    return languageElement;
}

function createElementWithText(tagName, text, ...classes) {
    const element = document.createElement(tagName);
    element.textContent = text;
    element.classList.add(...classes);
    return element;
}

function createDivider() {
    const element = document.createElement("div");
    element.classList.add("line");
    return element;
}
  
function sortItemsByName(item1, item2) {
    return item1.name.localeCompare(item2.name);
}
  
export function main() {
    getUsersAndProjects().then(([users, projects]) => {
        users.sort(sortItemsByName);
        projects.sort(sortItemsByName);
        const mergedUsers = mergeUsersAndProjects(users, projects);
        mergedUsers.forEach(createCardFromUser);
    }).catch(error => {
        console.error(error);
    });
}