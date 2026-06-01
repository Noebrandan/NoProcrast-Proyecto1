const KEYS = {
  NAME:       'salamanca_nombre',
  MISSIONS:   'salamanca_misiones',
  ESSENCE:    'salamanca_esencia',
  COLLECTION: 'salamanca_coleccion',
};

export function getName() {
  return localStorage.getItem(KEYS.NAME);
}

export function setName(name) {
  localStorage.setItem(KEYS.NAME, name);
}

export function getMissions() {
  const data = localStorage.getItem(KEYS.MISSIONS);
  return data ? JSON.parse(data) : [];
}

export function setMissions(missions) {
  localStorage.setItem(KEYS.MISSIONS, JSON.stringify(missions));
}

export function getEssence() {
  const value = localStorage.getItem(KEYS.ESSENCE);
  return value ? parseInt(value, 10) : 0;
}

export function setEssence(amount) {
  localStorage.setItem(KEYS.ESSENCE, amount);
}

export function addEssence(amount) {
  const newTotal = getEssence() + amount;
  setEssence(newTotal);
  return newTotal;
}

export function getCollection() {
  const data = localStorage.getItem(KEYS.COLLECTION);
  return data ? JSON.parse(data) : [];
}

export function addCard(card) {
  const collection = getCollection();
  collection.push(card);
  localStorage.setItem(KEYS.COLLECTION, JSON.stringify(collection));
}

export function resetAll() {
  Object.values(KEYS).forEach((key) => {
    localStorage.removeItem(key);
  });
}