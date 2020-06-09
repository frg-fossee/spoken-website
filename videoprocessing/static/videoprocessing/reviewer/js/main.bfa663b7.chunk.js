(this["webpackJsonpreviewer-frontend"]=this["webpackJsonpreviewer-frontend"]||[]).push([[0],{283:function(e,t,a){e.exports=a(508)},288:function(e,t,a){},289:function(e,t,a){},508:function(e,t,a){"use strict";a.r(t);var n=a(0),i=a.n(n),o=a(6),s=a.n(o),r=(a(288),a(86)),l=a(87),c=a(98),u=a(100),d=(a(289),a(33)),m=a(67),h=a.n(m),f=a(513),p=a(37),v=a(512),b=f.a.Text,g=[{title:"FOSS",dataIndex:"foss",key:"key",render:function(e){return e.name},sorter:function(e,t){return e.foss.name.localeCompare(t.foss.name)},sortDirections:["descend","ascend"]},{title:"Tutorial Name",dataIndex:"tutorial_detail",key:"key",render:function(e){return e.tutorial},sorter:function(e,t){return e.tutorial_detail.tutorial.localeCompare(t.tutorial_detail.tutorial)},sortDirections:["descend","ascend"]},{title:"Language",dataIndex:"language",key:"key",render:function(e){return e.name},sorter:function(e,t){return e.language.name.localeCompare(t.language.name)},sortDirections:["descend","ascend"]},{title:"Status",dataIndex:"submission_status",key:"key",filters:[{text:"Submitted for Review",value:"submitted"},{text:"Accepted",value:"accepted"},{text:"Rejected",value:"rejected"}],onFilter:function(e,t){return t.submission_status.includes(e)},render:function(e){return"submitted"===e?i.a.createElement(b,{type:"warning"},"Submitted for Review"):"accepted"===e?i.a.createElement(b,{style:{color:"green"}},"Accepted"):"rejected"===e?i.a.createElement(b,{type:"danger"},"Rejected"):void 0}},{title:"Review",dataIndex:"key",key:"key",render:function(e){return i.a.createElement(p.a,{href:"#/dashboard?id=".concat(e)},"Review")}}],k=function(e){Object(u.a)(a,e);var t=Object(c.a)(a);function a(e){var n;return Object(r.a)(this,a),(n=t.call(this,e)).state={tutorialsList:null,loading:!0},n}return Object(l.a)(a,[{key:"componentDidMount",value:function(){var e=this;h.a.get("".concat("/videoprocessing/api","/review")).then((function(t){e.setState({tutorialsList:t.data,loading:!1})}))}},{key:"render",value:function(){return i.a.createElement("div",null,i.a.createElement(v.a,{loading:this.state.loading,dataSource:this.state.tutorialsList,columns:g}))}}]),a}(i.a.Component),E=a(270),y=a.n(E),C=a(151),w=a.n(C),_=a(279),j=a(518),x=a(519),S=a(511),R=a(520),I=a(515),M=a(514),O=a(517),V=a(521),T=a(522),W=a(523),A=a(271),N=(a(502),f.a.Title),D=function(e){Object(u.a)(a,e);var t=Object(c.a)(a);function a(e){var n;return Object(r.a)(this,a),(n=t.call(this,e)).closeModal=function(){n.setState({isModalVisible:!1})},n.showComment=function(){n.setState({isCommentVisible:!0})},n.closeCommentModal=function(){n.setState({isCommentVisible:!1})},n.closeRejectionModal=function(){n.setState({isRejectionVisible:!1})},n.showRejectionModal=function(){n.setState({isRejectionVisible:!0})},n.openNotificationWithIcon=function(e,t,a){_.a[a]({message:e,description:t})},n.sendVerdict=function(e,t){h.a.post("".concat("/videoprocessing/api","/review/").concat(n.state.id,"/verdict"),e).then((function(){"accepted"===t?n.openNotificationWithIcon("Accepted","Tutorial Accepted Successfully","success"):n.openNotificationWithIcon("Rejected","Tutorial Rejected Successfully","warning")})).then((function(){n.props.history.push("/")})).catch((function(){n.openNotificationWithIcon("Error","Some Error Occurred","error")}))},n.acceptTutorial=function(){var e=new FormData;e.append("verdict","accepted"),n.sendVerdict(e,"accepted")},n.rejectTutorial=function(){var e=new FormData;e.append("verdict","rejected"),e.append("comment",n.state.comment),n.sendVerdict(e,"rejected")},n.state={loading:!0,id:null,isModalVisible:!1,oldChunk:null,newChunk:null,fetchingChunk:!0,chunks:[],status:"",tutorial_name:"",foss:"",total_count:"",processed_video:"",isCommentVisible:!1,isRejectionVisible:!1,comment:"",submission_status:""},n.showModal=function(e){n.setState({isModalVisible:!0,fetchingChunk:!0}),h.a.get("".concat("/videoprocessing/api","/review/").concat(n.state.id,"/").concat(e)).then((function(e){n.setState({oldChunk:e.data.history[e.data.history.length-1],newChunk:e.data.history[0]})})).then((function(){return n.setState({fetchingChunk:!1})}))},n.columns=[{title:"Chunk No.",dataIndex:"chunk_no",key:"chunk_no",width:"5%",render:function(e,t){return{props:{style:{backgroundColor:t.revisions>1?"#bae7ff":"white",fontWeight:t.revisions>1?"bold":"normal"}},children:i.a.createElement("div",null,e+1)}}},{title:"Audio",dataIndex:"audio_chunk",key:"audio_chunk",width:"10%",render:function(e,t){return{props:{style:{backgroundColor:t.revisions>1?"#bae7ff":"white",fontWeight:t.revisions>1?"bold":"normal"}},children:i.a.createElement(w.a,{src:e,controls:!0})}}},{title:"Start Time",dataIndex:"start_time",key:"start_time",width:"10%",render:function(e,t){return{props:{style:{backgroundColor:t.revisions>1?"#bae7ff":"white",fontWeight:t.revisions>1?"bold":"normal"}},children:i.a.createElement("div",null,e)}}},{title:"End Time",dataIndex:"end_time",key:"end_time",width:"10%",render:function(e,t){return{props:{style:{backgroundColor:t.revisions>1?"#bae7ff":"white",fontWeight:t.revisions>1?"bold":"normal"}},children:i.a.createElement("div",null,e)}}},{title:"Subtitle",dataIndex:"subtitle",key:"subtitle",width:"55%",render:function(e,t){return{props:{style:{backgroundColor:t.revisions>1?"#bae7ff":"white",fontWeight:t.revisions>1?"bold":"normal"}},children:i.a.createElement("div",null,e)}},sorter:function(e,t){return e.subtitle.localeCompare(t.subtitle)},sortDirections:["descend","ascend"]},{title:"Changes",dataIndex:"revisions",key:"revisions",width:"10%",render:function(e,t){return{props:{style:{backgroundColor:t.revisions>1?"#bae7ff":"white",fontWeight:t.revisions>1?"bold":"normal"}},children:i.a.createElement("div",null,i.a.createElement(p.a,{icon:i.a.createElement(V.a,null),onClick:function(){return n.showModal(t.chunk_no)},disabled:t.revisions<=1},"View Changes"))}}}],n}return Object(l.a)(a,[{key:"componentWillMount",value:function(){var e=y.a.parse(this.props.location.search,{ignoreQueryPrefix:!0}).id;this.setState({id:e})}},{key:"componentDidMount",value:function(){var e=this;h.a.get("".concat("/videoprocessing/api","/review/").concat(this.state.id)).then((function(t){e.setState({chunks:t.data.chunks,total_count:t.data.video_data.total_chunks,tutorial_name:t.data.video_data.tutorial_name,language:t.data.video_data.language,foss:t.data.video_data.foss,status:t.data.video_data.status,submission_status:t.data.video_data.submission_status,loading:!1,processed_video:t.data.video_data.processed_video,comment:t.data.video_data.comment})}))}},{key:"render",value:function(){var e,t=this;return"submitted"===this.state.submission_status?e=i.a.createElement(N,{level:4,type:"warning"},"Submitted for Review"):"accepted"===this.state.submission_status?e=i.a.createElement(N,{level:4,style:{color:"green"}},"Accepted"):"rejected"===this.state.submission_status&&(e=i.a.createElement(N,{level:4,type:"danger"},"Rejected")),i.a.createElement("div",null,i.a.createElement(p.a,{type:"round",icon:i.a.createElement(T.a,null),onClick:function(){return t.props.history.push("/")},size:"small"},"Back"),i.a.createElement(j.a,{align:"middle"},i.a.createElement(x.a,{style:{display:"inline-flex",justifyContent:"center",alignItems:"center"},span:8},i.a.createElement(f.a,null,i.a.createElement(N,{level:3},this.state.tutorial_name),i.a.createElement(N,{level:4},this.state.foss))),i.a.createElement(x.a,{style:{display:"inline-flex",justifyContent:"center",alignItems:"center"},span:8},i.a.createElement(f.a,null,e,i.a.createElement(N,null,i.a.createElement(S.a,{size:"large"},i.a.createElement(R.a,{title:"Are you sure\uff1f",okText:"Yes",cancelText:"No",disabled:"done"!==this.state.status||"submitted"!==this.state.submission_status,onConfirm:this.acceptTutorial},i.a.createElement(p.a,{disabled:"done"!==this.state.status||"submitted"!==this.state.submission_status,size:"large",type:"primary"},"Accept")),i.a.createElement(p.a,{size:"large",type:"primary",danger:!0,onClick:this.showRejectionModal,disabled:"done"!==this.state.status||"submitted"!==this.state.submission_status},"Reject"),i.a.createElement(p.a,{size:"large",icon:i.a.createElement(W.a,null),onClick:this.showComment,disabled:"done"!==this.state.status||"submitted"!==this.state.submission_status},"View Comment"))))),i.a.createElement(x.a,{style:{display:"inline-flex",justifyContent:"center",alignItems:"center"},span:8},"done"===this.state.status?i.a.createElement(A.Player,{fluid:!1,preload:"auto",height:200,playsInline:!0,src:this.state.processed_video}):i.a.createElement(I.a.Input,{style:{height:"200px"},active:!0}))),i.a.createElement(j.a,null,i.a.createElement(v.a,{loading:this.state.loading,className:"data-table",dataSource:this.state.chunks,columns:this.columns})),i.a.createElement(M.a,{loading:!0,width:"60vw",title:"View Changes",visible:this.state.isModalVisible,onOk:this.closeModal,onCancel:this.closeModal},this.state.fetchingChunk?null:i.a.createElement(j.a,{gutter:32},i.a.createElement(x.a,{span:12},i.a.createElement(f.a.Title,{level:4},"Old Version"),i.a.createElement("br",null),i.a.createElement(w.a,{src:"".concat("/media","/").concat(this.state.oldChunk.audio_chunk),controls:!0}),i.a.createElement("br",null)," ",i.a.createElement("br",null),i.a.createElement(f.a.Paragraph,null,this.state.oldChunk.subtitle)),i.a.createElement(x.a,{span:12},i.a.createElement(f.a.Title,{level:4},"New Version"),i.a.createElement("br",null),i.a.createElement(w.a,{src:"".concat("/media","/").concat(this.state.newChunk.audio_chunk),controls:!0}),i.a.createElement("br",null)," ",i.a.createElement("br",null),i.a.createElement(f.a.Paragraph,null,this.state.newChunk.subtitle)))),i.a.createElement(M.a,{title:"Comment from Contributor",visible:this.state.isCommentVisible,onOk:this.closeCommentModal,onCancel:this.closeCommentModal},i.a.createElement(f.a.Paragraph,null,this.state.comment)),i.a.createElement(M.a,{title:"Reject",visible:this.state.isRejectionVisible,onOk:this.rejectTutorial,okButtonProps:{danger:!0},onCancel:this.closeRejectionModal,okText:"Reject"},i.a.createElement(f.a.Text,null,"Rejection Message"),i.a.createElement(O.a.TextArea,{allowClear:!0,autoSizer:!0,rows:4,onChange:function(e){t.setState({comment:e.target.value})}})))}}]),a}(i.a.Component),z=Object(d.f)(D),P=a(516),F=function(e){Object(u.a)(a,e);var t=Object(c.a)(a);function a(e){var n;Object(r.a)(this,a),n=t.call(this,e);var i=e.cookies;return n.state={csrftoken:i.get("csrftoken")},h.a.defaults.headers.common["X-CSRFToken"]=n.state.csrftoken,n}return Object(l.a)(a,[{key:"render",value:function(){return i.a.createElement("div",null,i.a.createElement(d.c,null,i.a.createElement(d.a,{exact:!0,path:"/",component:k}),i.a.createElement(d.a,{path:"/dashboard",component:z})))}}]),a}(i.a.Component),B=Object(P.a)(F);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));var L=a(127);s.a.render(i.a.createElement(L.a,null,i.a.createElement(B,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[283,1,2]]]);
//# sourceMappingURL=main.bfa663b7.chunk.js.map