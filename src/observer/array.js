Array.prototype['$set'] = function (index, val) {
    if (index >= this.length) {
        this.length = index + 1;
    }
    // return this.splice(index, 1, val)[0];
    console.log(this);
    let temp = this.splice(index, 1, val);
    console.log(temp);
};
