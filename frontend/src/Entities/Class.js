class Class {
  constructor(id, name, classHours) {
    this.id = id;
    this.name = name;
    this.classHours = classHours;
  }

  getId() {
    return this.id;
  }
  getName() {
    return this.name;
  }
  getClassHours() {
    return this.classHours;
  }
}

export default Class