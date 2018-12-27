import Vue from "vue";
import data from "./data";
// import data from "./data.1";
import _ from "lodash";
new Vue({
    el: "#app",
    data() {
        let lists = data.lists.map(v => {
            return v.attr_value_id.split(",");
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
                //设置选中
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
                //l 是根据选择的属性计算出的其他属性有货的值
                let l = [];
                let tmpl = [];
                this.active.map(k => {
                    let tmp;
                    //筛选出包含一条属性的组合
                    tmpl.push(this.lists.filter(v => {
                        return v[k.key] == k.value;
                    }))
                    //
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
                
                this.selectAttr.map(v => {
                    for (let i in this.attrs) {
                        if (v != i) {
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
            }
        }
    },
    methods: {
        select(i, a, disable) {
            if (disable) return;

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
                    tmp=tmp.filter(v=>{
                        return v.key!=i;
                    })
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
        
            this.selectAttr = this.active.map(v => {
                return v.key;
            })
        },
        cl() {
        }

    }
})