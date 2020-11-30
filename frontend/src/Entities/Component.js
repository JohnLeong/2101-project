class Component {
  constructor(id, name, type, weightage) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.weightage = weightage;
  }
  
  getId() {
    return this.id;
  }
  getName() {
    return this.name;
  }
  getType() {
    return this.type;
  }
  getWeightage() {
    return this.weightage;
  }

  setName(name) {
    this.name = name;
  }
  setType(type) {
    this.type = type;
  }
  setWeightage(weightage) {
    this.weightage = weightage;
  }
}

export default Component;