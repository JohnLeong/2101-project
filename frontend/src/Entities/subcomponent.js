class SubComponent {
    constructor(id, name, weightage, studentMarks) {
        this.id = id;
        this.name = name;
        this.weightage = weightage;
        this.studentMarks = studentMarks;
    }

    getId() {
        return this.id;
    }
    getName() {
        return this.name;
    }
    getWeightage() {
        return this.weightage;
    }
    getStudentMarks() {
        return this.studentMarks;
    }

    setName(name) {
        this.name = name;
    }
    setWeightage(weightage) {
        this.weightage = weightage;
    }
}

export default SubComponent;