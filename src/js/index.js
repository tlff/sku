import Vue from "vue";
import data from "./data";
import _ from "lodash";
console.log(data);
new Vue({
    el: "#app",
    data() {
        let l = data.lists;
        let lists = l.map(v => {
            return v.attr_value_id.split(",");
        })
        let all = data.attrs.reduce((a, b) => {
            let ret = [];
            for (let i in a) {
                for (let j in b) {
                    ret.push([a[i], b[j]]);
                }
            }
            return ret;
        })
        let attrs = data.attrs.map(v => {
            return v.map(i => {
                return {
                    value: i,
                    disable: false,
                    isactive: false
                }
            })
        })
        return {
            //所有的属性
            attrs: attrs,
            //有货的组合
            lists: lists,
            //所有组合
            all: all,
            //选中的属性
            active: [],
            selectAttr: []
        }
    },
    watch: {
        active: {
            deep: true,
            handler: function () {
                //初始化attrs
                this.attrs = data.attrs.map(v => {
                    return v.map(i => {
                        return {
                            value: i,
                            disable: false,
                            isactive: false
                        }
                    })
                })
                //
                for (let i in this.attrs) {
                    for (let j in this.active) {
                        //选中的属性一样
                        if (this.active[j].key == i) {
                            for (let k in this.attrs[i]) {
                                //属性的值和选中的值一样
                                if (this.attrs[i][k].value == this.active[j].value) {
                                    this.attrs[i][k].isactive = true;
                                } else {
                                    this.attrs[i][k].isactive = false;
                                }
                            }
                        }
                    }
                }

                //根据选择的
                // let l = this.lists;
                //l 是根据选择的条件计算出的所有有货的集合
                let l = [];
                let tmpl = [];
                this.active.map(k => {
                    let tmp;
                    // console.log(k);
                    tmpl.push(this.lists.filter(v => {
                        return v[k.key] == k.value;
                    }))
                    if (tmpl.length > 1) {
                        tmp = _.intersection(...tmpl);
                    } else {
                        tmp = tmpl[0];
                    }
                    console.log(tmp);
                    let ret = [];
                    this.attrs.map((v, i) => {
                        if (k.key != i) {
                            l.push({
                                key: i,
                                value: tmp.map(v => {
                                    return v[i]
                                })
                            })
                        } else {

                        }
                    })
                    return ret;
                })
                console.log(l);
                // console.log([0].indexOf(0));
                // console.log(this.selectAttr.indexOf(1));
                // console.log(l);
                // console.log(this.selectAttr);
                for (let i in this.attrs) {
                    // if (this.selectAttr.indexOf(parseInt(i)) < 0) {
                    //     let tmp;
                    //     l.map(v=>{
                    //         if(v.key==i){
                    //             tmp=v.value;
                    //         }else{
                    //             return;
                    //         }
                    //     })
                    //     console.log(tmp);
                    //     for(let k in this.attrs[i]){
                    //         console.log(tmp.indexOf(this.attrs[i][k].value.toString()));
                    //         if(tmp.indexOf(this.attrs[i][k].value.toString())<0){
                    //             this.attrs[i][k].disable=true;   
                    //             this.attrs[i][k].isactive=false;   
                    //         }else{
                    //             this.attrs[i][k].disable=false;     
                    //         }
                    //     }
                    // }
                }
                // console.log(l);
                this.selectAttr.map(v => {
                    for (let i in this.attrs) {
                        if (v != i) {
                            // let tmp = l.map(v => {
                            //     return parseInt(v[i]);
                            // })
                            let tmp = [];
                            l.map(v => {
                                if (v.key == i) {
                                    if (tmp.length > 0) {

                                        tmp = _.intersection(tmp, v.value);
                                    } else {

                                        tmp = tmp.concat(v.value);
                                    }
                                } else {
                                    return;
                                }
                            })
                            // console.log(tmp);
                            for (let k in this.attrs[i]) {
                                if (tmp.length <= 0) {
                                    return;
                                }
                                // console.log(typeof this.attrs[i][k].value);
                                if (tmp.indexOf(this.attrs[i][k].value.toString()) < 0) {
                                    this.attrs[i][k].disable = true;
                                    this.attrs[i][k].isactive = false;
                                } else {
                                    this.attrs[i][k].disable = false;
                                }
                            }
                        }
                    }
                })
                // console.log(this.active);    
            }
        }
    },
    methods: {
        select(i, a, disable) {
            if (disable) return;

            // if(this.attrs[i])
            // for(let k in this.attrs[i]){
            //     (this.attrs[i][k].value==a){

            //     }   
            // }
            console.log(i, a);
            if (this.active.length > 0) {
                let tmp=[];
                let f=true;
                this.active.map(v => {
                    if (v.key == i && v.value == a) {
                        f=false;   
                    } else {
                        tmp.push(v);
                    }
                })
                if(f){
                    tmp.push({
                        key: i,
                        value: a
                    })
                }
                this.active=tmp;
            } else {
                this.active.push({
                    key: i,
                    value: a
                })
            }
            // if (this.active.indexOf({
            //     key: i,
            //     value: a
            // }) < 0) {
            //     this.active = this.active.filter(v => {
            //         return v.key != i;
            //     })
            //     this.active.push({
            //         key: i,
            //         value: a
            //     })
            // } else {
            //     this.active = this.active.filter(v => {
            //         return v.key != i;
            //     })
            // }
            this.selectAttr = this.active.map(v => {
                return v.key;
            })
        },
        cl() {
            return a;
        }

    }
})