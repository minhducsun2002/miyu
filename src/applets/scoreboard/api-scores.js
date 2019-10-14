export default async () => {
    return fetch(`/api/score`)
        .then(res => res.json())
        .then(responseBody => responseBody.map(({ name, result, aced, score }) => ({ name, result, aced, score })));
}
