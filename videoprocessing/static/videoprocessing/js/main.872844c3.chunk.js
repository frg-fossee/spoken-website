(this.webpackJsonpfrontend=this.webpackJsonpfrontend||[]).push([[0],{208:function(t,e,a){t.exports=a(426)},213:function(t,e,a){},214:function(t,e,a){},426:function(t,e,a){"use strict";a.r(e);var n=a(0),o=a.n(n),r=a(6),s=a.n(r),i=(a(213),a(60)),l=a(61),c=a(69),u=a(67),d=(a(214),a(425),a(201)),p=(a(225),a(205)),f=(a(138),a(203)),h=(a(228),a(83)),m=(a(427),a(204)),g=(a(73),a(17)),v=a(52),b=a.n(v),k=a(109),O=(a(140),a(104)),_=a(47),E=(a(141),a(105)),w=(a(135),a(37)),T=a(44),S=a.n(T),y=a(431),x=a(432),j=a(433),C=a(46),D=w.a.Option,I=E.a.Text,L=[{title:"FOSS",dataIndex:"foss",key:"foss",sorter:function(t,e){return t.foss.localeCompare(e.foss)},sortDirections:["descend","ascend"]},{title:"Tutorial Name",dataIndex:"tutorial",key:"tutorial",sorter:function(t,e){return t.tutorial.localeCompare(e.tutorial)},sortDirections:["descend","ascend"]},{title:"Language",dataIndex:"language",key:"language",sorter:function(t,e){return t.language.localeCompare(e.language)},sortDirections:["descend","ascend"]},{title:"Edit Video",dataIndex:"button",key:"button"}],A=function(t){Object(c.a)(a,t);var e=Object(u.a)(a);function a(t){var n;return Object(i.a)(this,a),(n=e.call(this,t)).state={tutorials:[],filteredTutorials:[],tutorialsInTable:[],searchFilteredTable:[],isLoading:!0,isTutDisabled:!0,fossDropdownOption:"All",tutorialDropdownOption:"All",searchBox:""},n.filterFosses=n.filterFosses.bind(Object(_.a)(n)),n.filterTutorials=n.filterTutorials.bind(Object(_.a)(n)),n.renderOptions=n.renderOptions.bind(Object(_.a)(n)),n.searchTable=n.searchTable.bind(Object(_.a)(n)),n.handleSubmit=n.handleSubmit.bind(Object(_.a)(n)),n}return Object(l.a)(a,[{key:"handleSubmit",value:function(t,e){var a=this;console.log(t,e);var n=new FormData;n.append("tutorial_detail",t),n.append("language",e),S.a.post("".concat("http://127.0.0.1:8000/videoprocessing/api","/process_tutorials"),n).then((function(t){console.log(t.data),a.props.history.push({pathname:"/dashboard",search:"id=".concat(t.data.id)})})).catch((function(t){O.a.error({message:"Error Occurred",description:t.response?"Status: ".concat(t.response.status," \n ").concat(t.response.statusText):"Some Error Occurred",onClick:function(){console.log("Notification Clicked!")}})}))}},{key:"filterFosses",value:function(){var t=Object(k.a)(b.a.mark((function t(e,a){var n,o;return b.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(console.log(e),"All"!==e){t.next=7;break}n=this.state.tutorials,console.log(n),this.setState({fossDropdownOption:"All",filteredTutorials:n,isTutDisabled:!0,tutorialsInTable:n,tutorialDropdownOption:"All"}),t.next=13;break;case 7:return o=this.state.tutorials,t.next=10,o.filter((function(t){return t.foss===e}));case 10:o=t.sent,console.log(o),this.setState({fossDropdownOption:e,filteredTutorials:o,isTutDisabled:!1,tutorialsInTable:o});case 13:case"end":return t.stop()}}),t,this)})));return function(e,a){return t.apply(this,arguments)}}()},{key:"filterTutorials",value:function(){var t=Object(k.a)(b.a.mark((function t(e,a){var n,o,r=this;return b.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if("All"!==e){t.next=8;break}return n=this.state.filteredTutorials,t.next=4,n.filter((function(t){return t.foss===r.state.fossDropdownOption}));case 4:n=t.sent,this.setState({tutorialsInTable:n,tutorialDropdownOption:e}),t.next=14;break;case 8:return o=this.state.filteredTutorials,t.next=11,o.filter((function(t){return t.tutorial===e}));case 11:o=t.sent,console.log(o),this.setState({tutorialsInTable:o,tutorialDropdownOption:e});case 14:case"end":return t.stop()}}),t,this)})));return function(e,a){return t.apply(this,arguments)}}()},{key:"renderOptions",value:function(t){var e=new Set,a=[];return"foss"===t?this.state.tutorials.map((function(t){e.add(t.foss)})):this.state.filteredTutorials.map((function(t){e.add(t.tutorial)})),(e=Array.from(e)).map((function(t,e){a.push(o.a.createElement(D,{key:e,value:t},t))})),a}},{key:"searchTable",value:function(){var t=Object(k.a)(b.a.mark((function t(e){var a,n;return b.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return a=e.target.value,n=this.state.tutorialsInTable,t.next=4,n.filter((function(t){var e=t.tutorial.toLowerCase().includes(a.toLowerCase()),n=t.foss.toLowerCase().includes(a.toLowerCase()),o=t.language.toLowerCase().includes(a.toLowerCase());return e||o||n}));case 4:n=t.sent,this.setState({searchFilteredTable:n,searchBox:a});case 6:case"end":return t.stop()}}),t,this)})));return function(e){return t.apply(this,arguments)}}()},{key:"componentDidMount",value:function(){var t=this,e=[],a=new Set,n=new Set,r=new Set;S.a.get("".concat("http://127.0.0.1:8000/videoprocessing/api","/tutorials")).then((function(s){s.data.map((function(s){var i={};return i.key=s.tutorial_detail.id,i.foss=s.foss_category.name,i.tutorial=s.tutorial_detail.tutorial,i.language=s.language.name,i.isEdited=!1,i.tutorial_id=s.tutorial_detail.id,i.language_id=s.language.id,i.button=o.a.createElement(m.a,{onConfirm:function(){return t.handleSubmit(s.tutorial_detail.id,s.language.id)},title:"Are you sure?",okText:"Yes",cancelText:"No"},o.a.createElement(g.a,{size:"large",icon:o.a.createElement(y.a,null)},"Edit Video")),e.push(i),a.add(i.foss),n.add(i.tutorial),r.add(i.language),e}))})).then((function(){S.a.get("".concat("http://127.0.0.1:8000/videoprocessing/api","/process_tutorials")).then((function(t){t.data.map((function(t){console.log(t);for(var a=0;a<e.length;a++)e[a].tutorial_id===t.tutorial_detail&&e[a].language_id===t.language&&(e[a].isEdited=!0,e[a].button=o.a.createElement(g.a,{size:"large",icon:o.a.createElement(x.a,null)},"View"))}))})).then((function(){t.setState({tutorials:e,isLoading:!1,filteredTutorials:e,tutorialsInTable:e})}))}))}},{key:"render",value:function(){return o.a.createElement("div",null,o.a.createElement(p.a,{xs:2,sm:4,md:6,lg:10,xl:10},o.a.createElement(h.a,{span:6,offset:1},o.a.createElement(I,{level:4},"FOSS \xa0 \xa0 \xa0"),o.a.createElement(w.a,{value:this.state.fossDropdownOption,size:"large",onChange:this.filterFosses,defaultValue:"All",style:{width:120}},o.a.createElement(D,{value:"All"},"All"),this.renderOptions("foss"))),o.a.createElement(h.a,{span:6},o.a.createElement(I,{level:3},"Tutorial  \xa0 \xa0 \xa0"),o.a.createElement(w.a,{value:this.state.tutorialDropdownOption,size:"large",disabled:this.state.isTutDisabled,style:{width:120},onChange:this.filterTutorials},o.a.createElement(D,{value:"All"},"All"),this.renderOptions("tutorials"))),o.a.createElement(h.a,{span:10},o.a.createElement(f.a,{allowClear:!0,size:"large",placeholder:"Search",prefix:o.a.createElement(j.a,null),onChange:this.searchTable})),o.a.createElement(h.a,{span:1})),o.a.createElement(d.a,{scroll:{y:"calc(100vh - 4em)"},loading:this.state.isLoading,dataSource:""!==this.state.searchBox?this.state.searchFilteredTable:this.state.tutorialsInTable,columns:L}))}}]),a}(o.a.Component),F=Object(C.f)(A),z=(a(419),a(202)),B=a(199),N=a.n(B),V=function(t){Object(c.a)(a,t);var e=Object(u.a)(a);function a(t){var n;return Object(i.a)(this,a),(n=e.call(this,t)).state={id:"",current_count:"",chunks:[],status:"",checksum:"",foss:"",tutorial_name:"",language:"",total_count:"",processed_video:"",processed:!1,progress_status:""},n.fetchData=function(){n.setState({processed:!1}),n.apiLoop=setInterval((function(){S.a.get("".concat("http://127.0.0.1:8000/videoprocessing/api","/process_tutorials/").concat(n.state.id)).then((function(t){console.log(t.data),n.setState({current_count:t.data.chunks.length,chunks:t.data.chunks,total_count:t.data.video_data.total_chunks,tutorial_name:t.data.video_data.tutorial_name,language:t.data.video_data.language,foss:t.data.video_data.foss,status:t.data.video_data.status,checksum:t.data.video_data.checksum}),null===t.data.video_data.processed_video?n.setState({processed_video:t.data.video_data.video}):n.setState({processed_video:t.data.video_data.processed_video}),"done"===t.data.video_data.status&&(clearInterval(n.apiLoop),n.setState({processed:!0}))})).catch((function(t){O.a.error({message:"Error Occurred",description:t.response?"Status: ".concat(t.response.status," \n ").concat(t.response.statusText):"Some Error Occurred",onClick:function(){console.log("Notification Clicked!")}}),n.setState({status:"not found",progress_status:"exception"}),clearInterval(n.apiLoop)}))}),2e3)},n}return Object(l.a)(a,[{key:"componentWillMount",value:function(){var t=N.a.parse(this.props.location.search,{ignoreQueryPrefix:!0}).id;this.setState({id:t})}},{key:"componentDidMount",value:function(){this.fetchData()}},{key:"componentWillUnmount",value:function(){clearInterval(this.apiLoop)}},{key:"render",value:function(){return o.a.createElement("div",null,o.a.createElement(z.a,{type:"circle",percent:parseInt(this.state.current_count/this.state.total_count*100),status:this.state.progress_status}),o.a.createElement(E.a.Title,{level:3},"Status: ",this.state.status.toUpperCase()))}}]),a}(o.a.Component),W=Object(C.f)(V),M=a(429),J=function(t){Object(c.a)(a,t);var e=Object(u.a)(a);function a(t){var n;Object(i.a)(this,a),n=e.call(this,t);var o=t.cookies;return n.state={csrftoken:o.get("csrftoken")},S.a.defaults.headers.common["X-CSRFToken"]=n.state.csrftoken,n}return Object(l.a)(a,[{key:"render",value:function(){return o.a.createElement("div",null,o.a.createElement(C.c,null,o.a.createElement(C.a,{exact:!0,path:"/",component:F}),o.a.createElement(C.a,{path:"/dashboard",component:W})))}}]),a}(o.a.Component),U=Object(M.a)(J);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));var P=a(78),Q=a(430);s.a.render(o.a.createElement(P.a,null,o.a.createElement(Q.a,null,o.a.createElement(U,null))),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(t){t.unregister()})).catch((function(t){console.error(t.message)}))}},[[208,1,2]]]);
//# sourceMappingURL=main.872844c3.chunk.js.map