(this.webpackJsonpfrontend=this.webpackJsonpfrontend||[]).push([[0],{253:function(e,t,a){e.exports=a(508)},258:function(e,t,a){},259:function(e,t,a){},494:function(e,t,a){},500:function(e,t,a){},508:function(e,t,a){"use strict";a.r(t);var n=a(0),o=a.n(n),r=a(4),i=a.n(r),l=(a(258),a(31)),s=a(32),c=a(34),u=a(33),d=(a(259),a(166),a(85)),h=(a(174),a(92)),p=(a(144),a(136)),m=(a(176),a(36)),f=(a(145),a(68)),g=(a(219),a(54)),v=(a(220),a(139)),b=(a(41),a(9)),E=a(48),y=a.n(E),k=a(87),w=(a(178),a(104)),S=a(70),_=(a(179),a(75)),C=(a(142),a(29)),D=a(38),O=a.n(D),x=a(511),T=a(512),V=a(513),j=a(514),I=a(515),L=a(69),A=C.a.Option,R=_.a.Text,F=[{title:"FOSS",dataIndex:"foss",key:"foss",sorter:function(e,t){return e.foss.localeCompare(t.foss)},sortDirections:["descend","ascend"]},{title:"Tutorial Name",dataIndex:"tutorial",key:"tutorial",sorter:function(e,t){return e.tutorial.localeCompare(t.tutorial)},sortDirections:["descend","ascend"]},{title:"Language",dataIndex:"language",key:"language",sorter:function(e,t){return e.language.localeCompare(t.language)},sortDirections:["descend","ascend"]},{title:"Edit Video",dataIndex:"button",key:"button"}],M=function(e){Object(c.a)(a,e);var t=Object(u.a)(a);function a(e){var n;return Object(l.a)(this,a),(n=t.call(this,e)).state={tutorials:[],filteredTutorials:[],tutorialsInTable:[],searchFilteredTable:[],isLoading:!0,isTutDisabled:!0,fossDropdownOption:"All",tutorialDropdownOption:"All",searchBox:""},n.filterFosses=n.filterFosses.bind(Object(S.a)(n)),n.filterTutorials=n.filterTutorials.bind(Object(S.a)(n)),n.renderOptions=n.renderOptions.bind(Object(S.a)(n)),n.searchTable=n.searchTable.bind(Object(S.a)(n)),n.handleSubmit=n.handleSubmit.bind(Object(S.a)(n)),n}return Object(s.a)(a,[{key:"handleSubmit",value:function(e,t){var a=this;console.log(e,t);var n=new FormData;n.append("tutorial_detail",e),n.append("language",t),O.a.post("".concat("http://127.0.0.1:8000/videoprocessing/api","/process_tutorials"),n).then((function(e){console.log(e.data),a.props.history.push({pathname:"/dashboard",search:"id=".concat(e.data.id)})})).catch((function(e){w.a.error({message:"Error Occurred",description:e.response?"Status: ".concat(e.response.status," \n ").concat(e.response.statusText):"Some Error Occurred",onClick:function(){console.log("Notification Clicked!")}})}))}},{key:"filterFosses",value:function(){var e=Object(k.a)(y.a.mark((function e(t,a){var n,o;return y.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(console.log(t),"All"!==t){e.next=7;break}n=this.state.tutorials,console.log(n),this.setState({fossDropdownOption:"All",filteredTutorials:n,isTutDisabled:!0,tutorialsInTable:n,tutorialDropdownOption:"All"}),e.next=13;break;case 7:return o=this.state.tutorials,e.next=10,o.filter((function(e){return e.foss===t}));case 10:o=e.sent,console.log(o),this.setState({fossDropdownOption:t,filteredTutorials:o,isTutDisabled:!1,tutorialsInTable:o});case 13:case"end":return e.stop()}}),e,this)})));return function(t,a){return e.apply(this,arguments)}}()},{key:"filterTutorials",value:function(){var e=Object(k.a)(y.a.mark((function e(t,a){var n,o,r=this;return y.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if("All"!==t){e.next=8;break}return n=this.state.filteredTutorials,e.next=4,n.filter((function(e){return e.foss===r.state.fossDropdownOption}));case 4:n=e.sent,this.setState({tutorialsInTable:n,tutorialDropdownOption:t}),e.next=14;break;case 8:return o=this.state.filteredTutorials,e.next=11,o.filter((function(e){return e.tutorial===t}));case 11:o=e.sent,console.log(o),this.setState({tutorialsInTable:o,tutorialDropdownOption:t});case 14:case"end":return e.stop()}}),e,this)})));return function(t,a){return e.apply(this,arguments)}}()},{key:"renderOptions",value:function(e){var t=new Set,a=[];return"foss"===e?this.state.tutorials.map((function(e){t.add(e.foss)})):this.state.filteredTutorials.map((function(e){t.add(e.tutorial)})),(t=Array.from(t)).map((function(e,t){a.push(o.a.createElement(A,{key:t,value:e},e))})),a}},{key:"searchTable",value:function(){var e=Object(k.a)(y.a.mark((function e(t){var a,n;return y.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return a=t.target.value,n=this.state.tutorialsInTable,e.next=4,n.filter((function(e){var t=e.tutorial.toLowerCase().includes(a.toLowerCase()),n=e.foss.toLowerCase().includes(a.toLowerCase()),o=e.language.toLowerCase().includes(a.toLowerCase());return t||o||n}));case 4:n=e.sent,this.setState({searchFilteredTable:n,searchBox:a});case 6:case"end":return e.stop()}}),e,this)})));return function(t){return e.apply(this,arguments)}}()},{key:"componentDidMount",value:function(){var e=this,t=[],a=new Set,n=new Set,r=new Set;O.a.get("".concat("http://127.0.0.1:8000/videoprocessing/api","/tutorials")).then((function(i){i.data.map((function(i){var l={};return l.key=i.tutorial_detail.id,l.foss=i.foss_category.name,l.tutorial=i.tutorial_detail.tutorial,l.language=i.language.name,l.isEdited=!1,l.tutorial_id=i.tutorial_detail.id,l.language_id=i.language.id,l.button=o.a.createElement(v.a,{onConfirm:function(){return e.handleSubmit(i.tutorial_detail.id,i.language.id)},title:"Are you sure?",okText:"Yes",cancelText:"No"},o.a.createElement(b.a,{size:"large",icon:o.a.createElement(x.a,null)},"Edit Video")),t.push(l),a.add(l.foss),n.add(l.tutorial),r.add(l.language),t}))})).then((function(){O.a.get("".concat("http://127.0.0.1:8000/videoprocessing/api","/process_tutorials")).then((function(e){e.data.map((function(e){console.log(e);for(var a=0;a<t.length;a++)t[a].tutorial_id===e.tutorial_detail&&t[a].language_id===e.language&&(t[a].isEdited=!0,t[a].button=o.a.createElement(b.a,{size:"large",icon:o.a.createElement(T.a,null),href:"#/dashboard?id=".concat(e.id)},"Edit Video"))}))})).then((function(){e.setState({tutorials:t,isLoading:!1,filteredTutorials:t,tutorialsInTable:t})}))}))}},{key:"render",value:function(){return console.log(this.props.fosses),o.a.createElement("div",null,o.a.createElement(g.a,null,o.a.createElement(g.a.Item,{href:"/"},o.a.createElement(V.a,null)),o.a.createElement(g.a.Item,null,o.a.createElement(j.a,null),o.a.createElement("span",null,"Video Processing"))),o.a.createElement(f.a,null),o.a.createElement(h.a,{xs:2,sm:4,md:6,lg:10,xl:10},o.a.createElement(m.a,{span:6,offset:1},o.a.createElement(R,{level:4},"FOSS \xa0 \xa0 \xa0"),o.a.createElement(C.a,{value:this.state.fossDropdownOption,size:"large",onChange:this.filterFosses,defaultValue:"All",style:{width:120}},o.a.createElement(A,{value:"All"},"All"),this.renderOptions("foss"))),o.a.createElement(m.a,{span:6},o.a.createElement(R,{level:3},"Tutorial  \xa0 \xa0 \xa0"),o.a.createElement(C.a,{value:this.state.tutorialDropdownOption,size:"large",disabled:this.state.isTutDisabled,style:{width:120},onChange:this.filterTutorials},o.a.createElement(A,{value:"All"},"All"),this.renderOptions("tutorials"))),o.a.createElement(m.a,{span:10},o.a.createElement(p.a,{allowClear:!0,size:"large",placeholder:"Search",prefix:o.a.createElement(I.a,null),onChange:this.searchTable})),o.a.createElement(m.a,{span:1})),o.a.createElement(f.a,{style:{backgroundColor:"white"}}),o.a.createElement(d.a,{loading:this.state.isLoading,dataSource:""!==this.state.searchBox?this.state.searchFilteredTable:this.state.tutorialsInTable,columns:F}))}}]),a}(o.a.Component),U=Object(L.f)(M),N=(a(211),a(135)),z=(a(212),a(103)),B=(a(467),a(249)),P=(a(469),a(248)),W=(a(164),a(86)),H=(a(213),a(91)),Y=a(239),J=a.n(Y),Q=a(240),X=a(102),$=a.n(X),q=a(171),G=a.n(q),K=a(516),Z=a(517),ee=a(518),te=a(519),ae=a(520),ne=a(521),oe=function(e){Object(c.a)(a,e);var t=Object(u.a)(a);function a(){return Object(l.a)(this,a),t.apply(this,arguments)}return Object(s.a)(a,[{key:"render",value:function(){return o.a.createElement(W.a,{status:"warning",title:"Media Not Found",extra:o.a.createElement(b.a,{type:"primary",href:"#"},"Back Home")})}}]),a}(o.a.Component),re=function(e){Object(c.a)(a,e);var t=Object(u.a)(a);function a(){return Object(l.a)(this,a),t.apply(this,arguments)}return Object(s.a)(a,[{key:"render",value:function(){return o.a.createElement(W.a,{status:"404",title:"404",subTitle:"Sorry, the page you visited does not exist.",extra:o.a.createElement(b.a,{type:"primary",href:"#"},"Back Home")})}}]),a}(o.a.Component),ie=(a(494),a(495),a(245)),le=a(242),se=a.n(le),ce=(a(500),H.a.TabPane),ue=C.a.Option,de=function(e){Object(c.a)(a,e);var t=Object(u.a)(a);function a(e){var n;return Object(l.a)(this,a),(n=t.call(this,e)).toggleSplitView=function(){n.setState({splitView:!n.state.splitView})},n.handleChangeCompare=function(e,t){console.log(e,t);var a=n.props.dataSource[e].subtitle;new Date(n.props.dataSource[e].history_date);"old"===t?n.setState({oldValue:a,oldDropDownValue:"Version ".concat(n.props.dataSource.length-e)}):n.setState({newValue:a,newDropDownValue:"Version ".concat(n.props.dataSource.length-e)})},n.resetDropdown=function(){n.setState({oldValue:"",newValue:"",oldDropDownValue:"Select a date",newDropDownValue:"Select a date"})},n.state={splitView:!0,oldValue:"",newValue:"",oldDropDownValue:"Select a version",newDropDownValue:"Select a version"},n}return Object(s.a)(a,[{key:"componentDidMount",value:function(){this.props.dataSource}},{key:"render",value:function(){var e=this,t=this.props,a=t.revertModalVisible,n=t.revertHandleCancel,r=t.isLoading,i=t.dataSource,l=t.revertChunk,s=t.chunk_no,c=[{title:"Version",key:"index",render:function(t,a,n){return e.props.dataSource.length-n},sortDirections:["descend","ascend"]},{title:"Date",dataIndex:"history_date",key:"history_date",render:function(e){var t=new Date(e);return"".concat(t.toDateString()," ").concat(t.toTimeString().split(" ")[0])}},{title:"Subtitle",dataIndex:"subtitle",key:"subtitle"},{title:"Audio",dataIndex:"audio_chunk",key:"audio_chunk",render:function(e){return o.a.createElement($.a,{src:"".concat("http://127.0.0.1:8000/media","/").concat(e),controls:!0,controlsList:"nodownload"})}},{title:"Revert",render:function(e,t,a){return o.a.createElement(v.a,{onConfirm:function(){return l(e.history_id,s)},title:"Are you sure?",okText:"Yes",cancelText:"No",disabled:0==a},o.a.createElement(b.a,{size:"middle",type:"primary",disabled:0===a},"Revert"))}}];return o.a.createElement(N.a,{className:"revertModal",footer:null,title:"Revisions",visible:a,onCancel:function(){n(),e.resetDropdown()},width:"60%"},o.a.createElement(H.a,{size:"large",type:"card"},o.a.createElement(ce,{tab:"Revert",key:"1"},o.a.createElement(d.a,{loading:r,columns:c,dataSource:i})),o.a.createElement(ce,{tab:"Compare",key:"2"},o.a.createElement(z.a,{style:{width:"88%"},size:"large",align:"baseline"},o.a.createElement(C.a,{value:this.state.oldDropDownValue,onChange:function(t){return e.handleChangeCompare(t,"old")},style:{width:240}},i.map((function(t,a){console.log(t);new Date(t.history_date);return o.a.createElement(ue,{key:t.history_id,value:a},"Version ".concat(e.props.dataSource.length-a))}))),"With",o.a.createElement(C.a,{value:this.state.newDropDownValue,onChange:function(t){return e.handleChangeCompare(t,"new")},style:{width:240}},i.map((function(t,a){console.log(t);new Date(t.history_date);return o.a.createElement(ue,{key:t.history_id,value:a},"Version ".concat(e.props.dataSource.length-a))})))),o.a.createElement(z.a,{style:{width:"12%"},align:"end"},"Split View",o.a.createElement(ie.a,{onChange:this.toggleSplitView,defaultChecked:!0})," "),o.a.createElement(f.a,null),o.a.createElement(se.a,{oldValue:this.state.oldValue,newValue:this.state.newValue,splitView:this.state.splitView}))))}}]),a}(o.a.Component),he=(a(506),a(247)),pe=a.n(he),me=_.a.Title,fe=_.a.Text,ge=H.a.TabPane,ve=function(e){Object(c.a)(a,e);var t=Object(u.a)(a);function a(e){var n;return Object(l.a)(this,a),(n=t.call(this,e)).ref=function(e){n.player=e},n.togglePlayButton=function(){n.state.playing?n.setState({playing:!1}):n.setState({playing:!0})},n.pauseVideo=function(e){var t=n.state.selected_chunk,a=n.state.chunks[t].start_time.split(":"),o=60*+a[0]*60+60*+a[1]+ +a[2],r=60*+(a=n.state.chunks[t].end_time.split(":"))[0]*60+60*+a[1]+ +a[2];Math.floor(e.playedSeconds)===r&&(n.setState({playing:!1}),n.player.seekTo(o,"seconds"))},n.startRecording=function(){n.setState({record:!0})},n.stopRecording=function(){n.setState({record:!1})},n.onSave=function(){var e=Object(k.a)(y.a.mark((function e(t){var a;return y.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,new File([t.blob],"record.webm");case 2:a=e.sent,n.setState({downloadURL:t.blobURL}),n.setState({audio_file:a});case 5:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),n.state={id:"",current_count:"",chunks:[],status:"loading",checksum:"",foss:"",tutorial_name:"",language:"",total_count:"",processed_video:"",processed:!1,progress_status:"",visible:!1,audio_file:"",uploading:!1,selected_chunk:0,selected_chunk_sub:"",playing:!1,revertModalVisible:!1,revisionData:[],revisionsTableLoading:!0,revertChunkSelected:"",subtitle:"",downloadURL:"",remove:function(){console.log("nothing to remove")},record:!1},n.handleChange=function(e){var t=e.target.value;n.setState({selected_chunk_sub:t})},n.revertShowModal=function(e){n.setState({revertModalVisible:!0,revisionData:[],revertChunkSelected:e}),O.a.get("".concat("http://127.0.0.1:8000/videoprocessing/api","/process_tutorials/").concat(n.state.id,"/").concat(e)).then((function(e){console.log(e.data.history),n.setState({revisionData:e.data.history})})).then((function(){n.setState({revisionsTableLoading:!1})}))},n.openNotificationWithIcon=function(e,t,a){w.a[a]({message:e,description:t})},n.handleChangeStatus=function(e,t){e.meta;var a=e.file,o=e.remove;"rejected_file_type"!==t?n.setState({audio_file:a,remove:o}):n.openNotificationWithIcon("Unsupported File","You can only upload .mp3 files","warning")},n.handleUpload=function(){n.setState({uploading:!0,progress_status:"normal",status:"Uploading"});var e=n.state,t=e.audio_file,a=e.selected_chunk,o=e.selected_chunk_sub;console.log(t);var r=new FormData;r.append("audio_chunk",t),r.append("subtitle",o),O.a.put("".concat("http://127.0.0.1:8000/videoprocessing/api","/process_tutorials/").concat(n.state.id,"/").concat(a),r).then((function(){n.fetchData(),n.setState({uploading:!1})})).then((function(){return n.handleCancel()})).catch((function(e){console.log(e.response),n.setState({uploading:!1,status:"done"}),n.handleCancel(),n.openNotificationWithIcon("Duplicate File","You have already uploaded this audio, Simply revert back","warning")}))},n.columns=[{title:"Chunk No.",dataIndex:"chunk_no",key:"chunk_no",width:"5%"},{title:"Audio",dataIndex:"audio_chunk",key:"audio_chunk",width:"10%",render:function(e){return o.a.createElement($.a,{src:e,controls:!0})}},{title:"Start Time",dataIndex:"start_time",key:"start_time",width:"10%"},{title:"End Time",dataIndex:"end_time",key:"end_time",width:"10%"},{title:"Subtitle",dataIndex:"subtitle",key:"subtitle",width:"55%",sorter:function(e,t){return e.subtitle.localeCompare(t.subtitle)},sortDirections:["descend","ascend"]},{title:"Change Audio/Subtitle",width:"10%",render:function(e){return o.a.createElement(b.a,{icon:o.a.createElement(K.a,null),onClick:function(){return n.changeAudioShowModal(e.chunk_no)},disabled:"done"!==n.state.status},"Change Audio / Subtitle")}},{title:"Revert",width:"10%",render:function(e){return console.log(e.revisions),o.a.createElement(b.a,{icon:o.a.createElement(Z.a,null),onClick:function(){return n.revertShowModal(e.chunk_no)},disabled:e.revisions<=1||"done"!==n.state.status},"Revert ")}}],n.changeAudioShowModal=function(e){n.state.remove();var t=n.state.chunks[e].subtitle,a=n.state.chunks[e].start_time;setTimeout((function(e){var t=a.split(":"),o=60*+t[0]*60+60*+t[1]+ +t[2];console.log(o),n.player.seekTo(o,"seconds")}),1e3),n.setState({visible:!0,selected_chunk:e,selected_chunk_sub:t})},n.handleOk=function(e){console.log(e),n.setState({visible:!1})},n.revertHandleCancel=function(){n.setState({revertModalVisible:!1})},n.revertChunk=function(e,t){n.setState({uploading:!0,progress_status:"normal",status:"Reverting"}),O.a.put("".concat("http://127.0.0.1:8000/videoprocessing/api","/process_tutorials/").concat(n.state.id,"/").concat(t,"/revert/").concat(e)).then((function(){n.fetchData(),n.setState({uploading:!1})})).then((function(){return n.revertHandleCancel()}))},n.handleCancel=function(e){console.log(e),n.setState({playing:!1}),n.setState({audio_file:"",visible:!1})},n.fetchData=function(){n.setState({processed:!1}),n.apiLoop=setInterval((function(){O.a.get("".concat("http://127.0.0.1:8000/videoprocessing/api","/process_tutorials/").concat(n.state.id)).then((function(e){console.log(e.data),n.setState({current_count:e.data.chunks.length,chunks:e.data.chunks,total_count:e.data.video_data.total_chunks,tutorial_name:e.data.video_data.tutorial_name,language:e.data.video_data.language,foss:e.data.video_data.foss,status:e.data.video_data.status,checksum:e.data.video_data.checksum}),null===e.data.video_data.processed_video?n.setState({processed_video:e.data.video_data.video}):n.setState({processed_video:e.data.video_data.processed_video,subtitle:e.data.video_data.subtitle}),"done"!==e.data.video_data.status&&"error"!==e.data.video_data.status&&"media_not_found"!==e.data.video_data.status||(clearInterval(n.apiLoop),n.setState({processed:!0}))})).catch((function(e){w.a.error({message:"Error Occurred",description:e.response?"Status: ".concat(e.response.status," \n ").concat(e.response.statusText):"Some Error Occurred",onClick:function(){console.log("Notification Clicked!")}}),n.setState({status:"not found",progress_status:"exception"}),clearInterval(n.apiLoop)}))}),2e3)},n}return Object(s.a)(a,[{key:"onData",value:function(e){console.log("chunk of real-time data is: ",e)}},{key:"onStop",value:function(e){console.log("recordedBlob is: ",e)}},{key:"componentWillMount",value:function(){var e=J.a.parse(this.props.location.search,{ignoreQueryPrefix:!0}).id;this.setState({id:e})}},{key:"componentDidMount",value:function(){this.fetchData()}},{key:"componentWillUnmount",value:function(){clearInterval(this.apiLoop)}},{key:"render",value:function(){var e=this.state,t=e.uploading,a=e.audio_file,n=this.state.status;return"loading"===n?o.a.createElement(W.a,{icon:o.a.createElement(ee.a,null),title:"Fetching Files"}):"not found"===n?o.a.createElement(re,null):"media_not_found"===n?o.a.createElement(oe,null):o.a.createElement("div",null,o.a.createElement(g.a,null,o.a.createElement(g.a.Item,{href:"/"},o.a.createElement(V.a,null)),o.a.createElement(g.a.Item,{href:"/videoprocessing"},o.a.createElement(j.a,null),o.a.createElement("span",null,"Video Processing")),o.a.createElement(g.a.Item,null,o.a.createElement("span",null,"Dashboard"))),o.a.createElement(h.a,{align:"middle"},o.a.createElement(m.a,{span:4,style:{display:"inline-flex",justifyContent:"center",alignItems:"center"}},o.a.createElement(P.a,{type:"circle",percent:parseInt(this.state.current_count/this.state.total_count*100),status:this.state.progress_status})),o.a.createElement(m.a,{style:{display:"inline-flex",justifyContent:"center",alignItems:"center"},span:4},o.a.createElement(_.a,null,o.a.createElement(me,{level:4},"Status: ",this.state.status.toUpperCase()),o.a.createElement(me,null,o.a.createElement(b.a,{type:"primary",icon:o.a.createElement(te.a,null),download:"video",href:this.state.processed_video,style:{textDecoration:"none",color:"white"}},"Download Tutorial"),o.a.createElement(b.a,{type:"primary",icon:o.a.createElement(te.a,null),download:"subtitle.srt",href:this.state.subtitle,style:{textDecoration:"none",color:"white"}},"Download Subtitle")))),o.a.createElement(m.a,{style:{display:"inline-flex",justifyContent:"center",alignItems:"center"},span:8},o.a.createElement(_.a,null,o.a.createElement(me,{level:3},this.state.tutorial_name),o.a.createElement(me,{level:4},this.state.foss))),o.a.createElement(m.a,{style:{display:"inline-flex",justifyContent:"center",alignItems:"center"},span:8},"done"===this.state.status?o.a.createElement(G.a,{height:200,url:this.state.processed_video,controls:!0}):o.a.createElement(B.a.Input,{style:{height:"200px"},active:!0}))),o.a.createElement(h.a,null,o.a.createElement(d.a,{className:"data-table",dataSource:this.state.chunks,columns:this.columns})),o.a.createElement(N.a,{title:"Change Audio",visible:this.state.visible,onOk:this.handleOk,okButtonProps:{type:"primary",onClick:this.handleUpload,disabled:0===a.length,loading:t,style:{marginTop:16}},okText:t?"Uploading":"Start Upload",onCancel:this.handleCancel,width:"60%"},o.a.createElement(h.a,{gutter:16},o.a.createElement(m.a,{span:12},o.a.createElement(G.a,{controls:!1,playing:this.state.playing,onProgress:this.pauseVideo,ref:this.ref,width:"100%",url:this.state.processed_video}),o.a.createElement("br",null),o.a.createElement("div",{style:{textAlign:"center"}},o.a.createElement(b.a,{size:"large",type:"primary",shape:"round",icon:this.state.playing?o.a.createElement(ae.a,null):o.a.createElement(ne.a,null),onClick:this.togglePlayButton}))),o.a.createElement(m.a,{span:12},o.a.createElement(H.a,{size:"large",type:"card"},o.a.createElement(ge,{tab:"Upload",key:"1"},o.a.createElement(pe.a,{initialFiles:[],canRemove:!1,className:"fileUploader",onChangeStatus:this.handleChangeStatus,accept:".mp3",multiple:!1,autoUpload:!1,maxFiles:1,styles:{dropzoneActive:{height:"60%"}},inputContent:"Drag Audio or Click to Browse"})),o.a.createElement(ge,{tab:"Record",key:"2"},o.a.createElement("div",null,o.a.createElement(Q.ReactMic,{record:this.state.record,className:"sound-wave",onStop:this.onStop,onData:this.onData,onSave:this.onSave,strokeColor:"#000000",backgroundColor:"white"}),o.a.createElement(z.a,null,o.a.createElement(b.a,{type:"primary",shape:"round",onClick:this.startRecording,disabled:!0===this.state.record}," Start "),o.a.createElement(b.a,{type:"primary",shape:"round",onClick:this.stopRecording,disabled:!1===this.state.record}," Stop "),o.a.createElement(b.a,{type:"primary",shape:"round",disabled:""===this.state.downloadURL,href:this.state.downloadURL,download:"recording.webm"},"Download")),this.state.downloadURL?o.a.createElement("div",null,o.a.createElement(f.a,null),o.a.createElement($.a,{src:this.state.downloadURL,controls:!0})):null))),o.a.createElement(f.a,null),o.a.createElement(fe,null,"Subititle"),"done"===n?o.a.createElement(p.a.TextArea,{allowClear:!0,autoSize:!0,value:this.state.selected_chunk_sub,onChange:this.handleChange}):null))),o.a.createElement(de,{revertModalVisible:this.state.revertModalVisible,revertHandleCancel:this.revertHandleCancel,dataSource:this.state.revisionData,isLoading:this.state.revisionsTableLoading,chunk_no:this.state.revertChunkSelected,revertChunk:this.revertChunk}))}}]),a}(o.a.Component),be=Object(L.f)(ve),Ee=a(509),ye=function(e){Object(c.a)(a,e);var t=Object(u.a)(a);function a(e){var n;Object(l.a)(this,a),n=t.call(this,e);var o=e.cookies;return n.state={csrftoken:o.get("csrftoken")},O.a.defaults.headers.common["X-CSRFToken"]=n.state.csrftoken,n}return Object(s.a)(a,[{key:"render",value:function(){return o.a.createElement("div",{className:"App"},o.a.createElement(L.c,null,o.a.createElement(L.a,{exact:!0,path:"/",component:U}),o.a.createElement(L.a,{path:"/dashboard",component:be})))}}]),a}(o.a.Component),ke=Object(Ee.a)(ye);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));var we=a(97),Se=a(510);i.a.render(o.a.createElement(we.a,null,o.a.createElement(Se.a,null,o.a.createElement(ke,null))),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[253,1,2]]]);
//# sourceMappingURL=main.2916d188.chunk.js.map