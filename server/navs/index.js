class NavElement {
    constructor(name, parents) {
        this.name = name;
        this.parents = parents;
        this.method = name.split('__')[0];
    }

    
}