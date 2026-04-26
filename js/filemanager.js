const owner = "filipepre";
const repo = "projectsfp";
const path = "data/projects.json";
const branch = "main";
const token = "";

async function getFile() {
  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  const data = await res.json();

  const json = JSON.parse(atob(data.content));

  return {
    json,
    sha: data.sha
  };
}

async function updateFile(newJson, sha) {
  const contentEncoded = btoa(JSON.stringify(newJson, null, 2));

  await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: "update projects.json via site",
        content: contentEncoded,
        sha: sha,
        branch: branch
      })
    }
  );
}

async function addProject() {
  const file = await getFile();

  file.json.push({
    name: "Novo projeto",
    date: "2026",
    status: "ativo"
  });

  await updateFile(file.json, file.sha);
}