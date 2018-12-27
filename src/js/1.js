// window.jQuery=require("jquery");
// require("icheck");
import "icheck";
import "../css/index.css";
import $ from "jquery";
const jpg=require("../images/1.jpg");
export default class a{
    say(){
        return 123;
    }
    icheck(id){
        $("#"+id).iCheck();
    }
}