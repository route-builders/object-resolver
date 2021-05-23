const target = {
  First: [
    { id: '123456', name: 'taro', health: { height: 170, weight: 60 } },
    { id: '456789', name: 'jiro', health: { height: 170, weight: 70 } },
    { id: '999999', name: 'saburo', health: { height: 180, weight: 70 } },
  ],
};

const ARRAY_NEEDLE_REGEX = /^([A-Za-z0-9_]+)\[\](\{[\s\S]*?\})$/;
const path1 = `First[]{"id": "123456"}`;
const path2 = `First[]{"id": "123456", "name": "taro"}`;
const path3 = `First[]{"id": "123456", "name": "taro", "health": { "height": 170, "weight": 60 }}`;

const matcher = path3.match(ARRAY_NEEDLE_REGEX);
const json = JSON.parse(matcher[2]);
console.log(json);

for (const key in json) {
  if (Object.prototype.hasOwnProperty.call(json, key)) {
    const element = json[key];

    console.log(key, element, typeof element);
  }
}
