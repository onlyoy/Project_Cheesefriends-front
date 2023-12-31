import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import Modal from "./modal";
import Post from "./Post";

import "./css/login.css";
import "./css/login2.css";

import logo from './img/cheesefriendslogo.png';
import camera from './img/cameraimg.png';

function RegiParents(){

    
    function regiselect(){
        window.location.href = "/regiselect";
    }

    const [id, setId] = useState('');
    const [idc, setIdc] = useState("");
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [gender, setGender] = useState("man");
    const [email, setEmail] = useState('');
    const [birth, setBirth] = useState("");
    const [address, setAddress] = useState("");
    const [facename, setFacename] = useState("");
    const [phone, setPhone] = useState("");
    const [phone_public, setPhone_public] = useState("");
    const [auth, setAuth] = useState('parents');

    const [studentidinput, setStudentidinput] = useState("");
    const [studentnameresult, setStudentnameresult] = useState("");
    const [studentidresult, setStudentidresult] = useState("");
    const [studentidcheck, setStudentidcheck] = useState(false);
    const [authresult, setAuthresult] = useState("");

    const [passwordcheck, setPasswordcheck] = useState("");

    // 계정 연동
    const [joinid, setJoinid] = useState("");
    const [jointype, setJointype] = useState("");

    useEffect (()=>{
       

       let soc = localStorage.getItem("social");
       let social = JSON.parse(soc)

       let socialtype = localStorage.getItem("socialtype");

       if(socialtype === "kakao"){
           if(social !== undefined){

               setJoinid(social.id);
               setJointype(socialtype);

               if(social.gender === "female"){
                   setGender("woman");
               }else{
                   setGender("man");
               }

               if(social.email !== null && social.email !== "" && social.email !== undefined){
                   setEmail(social.email);
               }
           }
       }else if(socialtype === "google"){
           if(social !== undefined){

               setJoinid(social.sub);
               setJointype(socialtype);

               if(social.gender === "female"){
                   setGender("woman");
               }else{
                   setGender("man");
               }

               if(social.email !== null && social.email !== "" && social.email !== undefined){
                   setEmail(social.email);
               }
           }
       }else if(socialtype === "naver"){
           if(social !== undefined){

               setJoinid(social.id);
               setJointype(socialtype);

               if(social.gender !== "M"){
                   setGender("woman");
               }else{
                   setGender("man");
               }

               if(social.name !== null && social.name !== "" && social.name !== undefined ){
                   setName(social.name);
               }

               if(social.email !== null && social.email !== "" && social.email !== undefined){
                   setEmail(social.email);
               }
           }
       }else if(socialtype === "cheesefriends"){
           setJointype(socialtype);
       }

   },[]);

    // 주소 api
    const [enroll_company, setEnroll_company] = useState({ address:'', });
    const [popup, setPopup] = useState(false);

    // 모달 팝업
    const [modalOpen, setModalOpen] = useState(false);

    const openModal = () => {
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    // 이름 정규식
    const nameRegEx = /^[가-힣]{2,6}$/;
    const [namec, setNamec] = useState("");

    const namecheck = (name) => {
            if(name.match(nameRegEx)===null) {
                setNamec("이름을 입력해주세요");
            return;
            }else{
                setNamec("입력되었습니다");
            }
    }

    useEffect(()=>{
        namecheck(name);        
    }, [name]) 
    

    function genderChange(e){
        setGender(e.target.value);
    }


    // 자녀 아이디 체크
    function studentidcheckfunction(){
        axios.get("http://localhost:3000/idmatching", { params:{ "studentid":studentidinput}})
        .then(function(resp){
            if(resp.data !== "" && resp.data !== null && resp.data !== undefined){
                setStudentnameresult(resp.data.name);
            }else{
                setStudentnameresult("");
            }
        })
        .catch(function(err){
            alert('err')
        })    
    }

    useEffect(()=>{
           studentidcheckfunction(studentidinput);        
   }, [studentidinput]) 


   // 체크박스 관리 변수
   const [studentidcheckbox, setStudentidcheckbox] = useState([]);

   // 체크박스 관리 함수
   const studentidadd = (e) =>{
        console.log("e.target.checked : " + e.target.checked);
        console.log("e.target.value : " + e.target.value);

        if(e.target.checked){
         //   alert("과목 체크 추가");
            setStudentidcheckbox((studentidcheckbox) => [...studentidcheckbox, e.target.value])

            return;
        }else{
         //   alert("과목 체크 제거");
            setStudentidcheckbox((studentidcheckbox) => studentidcheckbox.filter((item)=> item !== e.target.value));

            return;
        }
   }

   // 체크 배열 점검
    useEffect(()=>{
        console.log(studentidcheckbox);
    }, [studentidcheckbox]) 


   // 추가된 과목 리스트 관리
   const [childadd, setChildadd] = useState(false);
   const [count, setCount] = useState(1);
   const [studentidlist, setStudentidlist] = useState([]);

   function studentadd(){
        // 과목 중복추가 체크
        for (let i = 0; i < studentidlist.length; i++) {
            if(studentidlist[i] === studentidresult){
                alert("해당 자녀의 아이디가 이미 추가되었습니다")
                return;
            }
        }

        axios.get("http://localhost:3000/idmatching", { params:{ "studentid":studentidinput}})
        .then(function(resp){
            if(resp.data === "" || resp.data === null){
                alert("해당 아이디로 검색되는 계정이 없습니다");
            }

            if(resp.data.auth === "student"){
                console.log("studentidresult : " + resp.data.id)
                axios.post("http://localhost:3000/studentidmatching", null, { params:{ "studentid":resp.data.id}})
                .then(function(res){
                    if(res.data === "YES"){
                    
                        const newItem = resp.data.id;
                        setStudentidlist([...studentidlist, newItem]);
    
                        const table = document.getElementById("subplus2");
                        const subplus = document.createElement("tr");
    
                        if(childadd === false){
                            table.removeChild(table.lastChild);
                        }
    
                        // 체크박스
                        let td = document.createElement("td");
                        let element0 = document.createElement("input");
    
                        element0.setAttribute("type", "checkbox");
                        element0.setAttribute("name", "subject");
                        element0.setAttribute("value", resp.data.id);
                        element0.setAttribute("checked", "checked");
                    //    element0.setAttribute("onchange", function(){alert('subcodeadd');});
                        element0.onchange = studentidadd; //function(){alert('subcodeadd');};
    
                        td.append(element0)
                        subplus.appendChild(td);
    
                        setStudentidcheckbox((studentidcheckbox) => [...studentidcheckbox, resp.data.id])
    
                        // 번호
                        let element = document.createElement("td");
                        element.innerText = count;
                        setCount(count+1);
                        subplus.appendChild(element);
    
                        // 아이디
                        let element2 = document.createElement("td");
                        element2.innerText = resp.data.id;
                        subplus.appendChild(element2);
    
                        let element3 = document.createElement("td");
                        element3.innerText = resp.data.name;
                        subplus.appendChild(element3);
    
                        table.appendChild(subplus);
    
                        setChildadd(true);
                    }else{
                        alert("이미 해당 자녀와 연결된 학부모 계정이 있습니다")
                        return;
                    }
                })
                .catch(function(err){
                    console.log(err);
                    alert('err')
                })
            }
            else if(resp.data.auth === "parents"){
                alert("학부모로 가입된 아이디입니다");
                return;
            }else if(resp.data.auth === "teacher"){
                alert("교사로 가입된 아이디입니다");
                return;
            }
    
        })
        .catch(function(err){
            alert('err')
        })
        
   }


    // 아이디 정규식
    const idRegEx = /^[a-zA-z0-9]{6,12}$/

    const idregCheck = (id) => {
        if(id.match(idRegEx)===null) { //형식에 맞지 않을 경우 아래 콘솔 출력
            setIdc("아이디 형식을 확인해주세요");
            return;
        }else{ // 맞을 경우 출력
            axios.post("http://localhost:3000/idcheck", null, { params:{ "id":id}})
            .then(function(resp){
                if(resp.data === "YES"){
                    setIdc("이 아이디는 사용할 수 있습니다");
                }else{
                    setIdc("사용중인 아이디입니다");
                }
            })
            .catch(function(err){
                alert('err')
            })
        }
    }

    useEffect(()=>{
           idregCheck(id);        
   }, [id]) 


    // 비밀번호 정규식
    const passwordRegEx = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,25}$/
    const [passwordc, setPasswordc] = useState("");

    const passwordCheck = (password) => {
        if(password.match(passwordRegEx)===null) { //형식에 맞지 않을 경우 아래 콘솔 출력
            setPasswordc("비밀번호 형식을 확인해주세요");
            return;
        }else{ // 맞을 경우 출력
            setPasswordc("안전한 비밀번호 입니다");
        }
    }

    useEffect(()=>{
        passwordCheck(password);
    },[password])
    

    // 비밀번호 확인 체크
    const [passwordcheckc, setPasswordcheckc] = useState("");

    const passwordDoubleCheck = (password, passwordcheck) => {
            if(password !== passwordcheck){
                setPasswordcheckc("비밀번호가 다릅니다");
                return;
            }else{
                setPasswordcheckc("비밀번호가 동일합니다");
            }
    }

    useEffect(()=>{
        passwordDoubleCheck(password, passwordcheck);
    },[password, passwordcheck])


    // 이메일 정규식
    const emailRegEx = /^[A-Za-z0-9]([-_.]?[A-Za-z0-9])*@[A-Za-z0-9]([-_.]?[A-Za-z0-9])*\.[A-Za-z]{2,3}$/i;
    const [emailc, setEmailc] = useState("");

    const emailCheck = (email) => {
        if(email.match(emailRegEx)===null) { //형식에 맞지 않을 경우 아래 콘솔 출력
            setEmailc("이메일 형식을 확인해주세요");
            return;
        }else{ // 맞을 경우 출력
            setEmailc("형식에 맞는 이메일입니다");
        }
    }

    useEffect(()=>{
        emailCheck(email);
    },[email])

    
    // 생년월일 정규식
    const birthRegEx = /^([0-9][0-9]|20\d{2})(0[0-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1])$/
    const [birthc, setBirthc] = useState("");

    const birthCheck = (birth) => {
        if(birth.match(birthRegEx)===null) { //형식에 맞지 않을 경우 아래 콘솔 출력
            setBirthc("형식에 맞게 다시 입력해주세요");
            return;
        }else{ // 맞을 경우 출력
            setBirthc("올바르게 입력되었습니다");
        }
    }

    useEffect(()=>{
        birthCheck(birth);
    },[birth])

    // 주소 적용
    useEffect(()=>{
        setAddress(enroll_company.address);
    },[enroll_company.address])


    // 핸드폰 번호 정규식
    const phoneRegEx = /^01(?:0|1|[6-9])-(?:\d{4}|\d{4})-\d{4}$/
    const [phonec, setPhonec] = useState("");

    const phoneCheck = (phone) => {
        if(phone.match(phoneRegEx)===null) { //형식에 맞지 않을 경우 아래 콘솔 출력
            setPhonec("형식에 맞게 다시 입력해주세요");
            return;
        }else{ // 맞을 경우 출력
            setPhonec("올바르게 입력되었습니다");
        }
    }

    useEffect(()=>{
        phoneCheck(phone);
        if (phone.length === 10) {
            setPhone(phone.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3'));
          }
          if (phone.length === 13) {
            setPhone(phone.replace(/-/g, '').replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3'));
          }
    },[phone])

    
    // 휴대폰 인증번호 발송
    const [phone_publicc, setPhone_publicc] = useState("");
    const [phone_publicch, setPhone_publicch] = useState(false);

    function sendPhone(){
        axios.post("http://localhost:3000/phoneAuth", null, { params:{ "phone":phone }})
        .then(function(resp){
            setPhone_publicc("");
            setPhone_publiccheck("");
            alert("인증번호를 보냈습니다");
            setPhone_publicch(false);
            if(resp.data !== null){
                setPhone_publicc(resp.data); 
                setPhone_publicch(true);
            }else{
                alert("휴대폰 번호를 확인해주세요");
            }
        })
        .catch(function(err){
            alert("err");
        })
    }

    // 휴대폰 인증번호 체크
    const [phone_publiccheck, setPhone_publiccheck] = useState("");

    function sendphonecheck(){
        if(phone_publicc.toString().trim() !== phone_public.toString().trim()){
            setPhone_publiccheck("인증 번호를 확인해주세요");
        }else{
            setPhone_publiccheck("인증 완료되었습니다");
            setPhone_publicch(false);
        }
    }

    // 휴대폰 번호 변경시 재인증 필요
    useEffect(()=>{
        setPhone_publiccheck("");
    },[phone])

    
    const [photostart, setPhotostart] = useState(false);
    const videoRef = useRef(null);
    const [imageSrc, setImageSrc] = useState(null);
    const [captured, setCaptured] = useState(false);
    const [mediaStream, setMediaStream] = useState(null);

    const startCapture = async () => {
        setPhotostart(true);
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = stream;
        setMediaStream(stream);
        setCaptured(false);
        console.log("카메라작동")    
    };
    
    const captureImage = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 350; // 캡쳐 크기
        canvas.height = 250;
        canvas.getContext('2d').drawImage(videoRef.current, 0, 0, 350, 250);
        canvas.toBlob((blob) => {
        setImageSrc(blob);
        setCaptured(true);
        mediaStream.getTracks()[0].stop(); // 미디어 스트림 중지
        }, 'image/png');
        setFacename(id + ".jpg");
    };
    
    const saveImage = () => {
        const formData = new FormData();
        formData.append('uploadFile', imageSrc, id + ".jpg");
    
        fetch('http://localhost:3000/fileUpload', {
        method: 'POST',
        body: formData,
        })
        // .then((response) => response.json())
        .then((result) => console.log(result))
        .catch((error) => console.error(error));
    };


    let history = useNavigate();

    function idChange(e){
        setId(e.target.value);
    }


    const [namea, setNamea] = useState(true);
    const [codea, setCodea] = useState(true);
    const [ida, setIda] = useState(true);
    const [passworda, setPassworda] = useState(true);
    const [passwordChecka, setPasswordchecka] = useState(true);
    const [emaila, setEmaila] = useState(true);
    const [birtha, setBirtha] = useState(true);
    const [addressa, setAddressa] = useState(true);
    const [photoa, setPhotoa] = useState(true);
    const [phonea, setPhonea] = useState(true);
    const [phone_publica, setPhone_publica] = useState(true);

    function account(){
        // 회원가입 유효검사
        setNamea(true);
        setCodea(true);
        setIda(true);
        setPassworda(true);
        setPasswordchecka(true);
        setEmaila(true);
        setBirtha(true);
        setAddressa(true); 
        setPhotoa(true);
        setPhonea(true); 
        setPhone_publica(true);

        if(namec !== "입력되었습니다"){
            setNamea(false);
            alert("이름을 입력해주세요");
            return;
        }else if(studentidlist.length === 0){
            setCodea(false);
            alert("자녀 아이디 입력 후 추가 및 선택해주세요");
            return;
        }else if(idc !== "이 아이디는 사용할 수 있습니다"){
            setIda(false);
            alert("아이디를 입력해주세요");
            return;
        }else if(passwordc !== "안전한 비밀번호 입니다" ){
            setPassworda(false);
            alert("비밀번호를 입력해주세요");
            return;
        }else if(passwordcheckc !== "비밀번호가 동일합니다"){
            setPasswordchecka(false);
            alert("동일한 비밀번호를 입력해주세요");
            return;
        }else if(emailc !== "형식에 맞는 이메일입니다" ){
            setEmaila(false);
            alert("이메일을 입력해주세요");
            return;
        }else if(birthc !== "올바르게 입력되었습니다" ){
            setBirtha(false);
            alert("생년월일을 입력해주세요");
            return;
        }else if(address === ""){
            setAddressa(false);
            alert("주소를 입력해주세요");
            return;
        }else if(imageSrc === "" || imageSrc === null){
            setPhotoa(false);
            alert("사진을 찍어주세요");
            return;
        }else if(phonec !== "올바르게 입력되었습니다"){
            setPhonea(false);
            alert("휴대폰 번호를 입력해주세요");
            return;
        }else if(phone_publiccheck !== "인증 완료되었습니다" ){
            setPhone_publica(false);
            alert("인증번호를 입력해주세요");
            return;
        }

        // 해당 번호로 이미 가입된 계정이 있는지 체크
        axios.post("http://localhost:3000/phonecheck", null, { params: { "phone": phone } })
        .then(function (resp) {
            if (resp.data === "YES") {
                // 보내자
                axios.post("http://localhost:3000/adduser", null, 
                { params:{  "id":id, 
                            "password":password, 
                            "name": name, 
                            "gender":gender,
                            "email":email,
                            "birth":birth,
                            "address":address,
                            "facename": id + ".jpg",
                            "phone": phone,
                            "auth":auth,
                            "jointype":jointype,
                            "joinid":joinid
                        }})
                .then(function(resp){
                    for (let i = 0; i < studentidcheckbox.length; i++) {
                        console.log("studentidcheckbox : " + studentidcheckbox)
                        if(resp.data === "YES"){
                            // 자녀 보내자
                            axios.post("http://localhost:3000/adduserparents", null, 
                            { params:{  
                                        "studentid":studentidcheckbox[i],
                                        "parentsid":id
                                    }})
                            .then(function(resp){
                                if(resp.data === "YES"){
                                //   alert("정상적으로 가입되었습니다");
                                //   history("/");      // 이동(link)
                                }else{
                                    alert("가입되지 않았습니다");
                                }
                            })
                            .catch(function(err){
                                alert("err");
                                console.log(err);
                            })
                    
                        }else{
                            alert("가입되지 않았습니다");
                        }
                    }
                })
                .catch(function(err){
                    alert("err");
                    console.log(err);
                })

                // 사진저장
                const formData = new FormData();
                formData.append('uploadFile', imageSrc, id + ".jpg");

                fetch('http://localhost:3000/fileUpload', {
                    method: 'POST',
                    body: formData,
                })
                    // .then((response) => response.json())
                    .then((result) => console.log(result))
                    .catch((error) => console.error(error));
            
                alert("정상적으로 가입되었습니다");
                history("/");      // 이동(link)
                
            } else {
                alert("이미 해당 번호로 가입된 계정이 있습니다");
                return;
            }
        })
        .catch(function (err) {
            alert('err')
        })
    
    }
        

    

    return(
        <div>
            {/* // Login css 세트 1 */}
            <div style={{textAlign:"center", alignItems:"center"}}>
                <br/><br/><br/>
                <img src={logo} style={{width:"300px", height:"100px", marginLeft:"auto", marginRight:"auto"}}/>
                <br/><br/><br/>
                {/* <h1 class="regititle">회원가입</h1>   
                <br/> */}

                <div class="container2">
                 
                    <div class="regi-content">
           
                      
                        {/* 이름 입력칸 */}
                        <div class="divflex">
                        <h5 class="regitag">이름</h5>
                        {namea === true
                                ? <input class="regiinput" value={name} onChange={(e) => setName(e.target.value)} placeholder="이름을 입력해주세요" />
                                : <input class="regiinput" style={{ borderColor: "red" }} value={name} onChange={(e) => setName(e.target.value)} placeholder="이름을 입력해주세요" />}
                        </div>
                        {namea === true 
                            ?<div></div>
                            :<div>{ namec === "입력되었습니다" 
                                ? <div><div class="checkdiv" style={{ fontSize: "5px", color: 'blue' }}>{namec}</div></div>
                                : <div><div class="checkdiv" style={{ fontSize: "5px", color: 'red' }} >{namec}</div></div>} 
                        </div>}
                        <br/>

                        {/* 성별 선택 */}
                        <div class="divflex">
                        <h5 class="regitag">성별</h5>
                        <div>
                            <select class="regiinput" onChange={genderChange}>
                                <option value="">성별을 선택해주세요</option>
                                <option value="man" selected={gender === 'man'} >남자</option>
                                <option value="woman" selected={gender === 'woman'}>여자</option>
                            </select>
                        </div>
                        </div>
                        <br/>

                        
                        {/* 자녀 아이디 입력칸 */}
                        <div class="divflex">
                        <h5 class="regitag">자녀 아이디</h5>
                        {codea === true 
                            ? <input class="regiinput" value={studentidinput} onChange={(e)=>setStudentidinput(e.target.value)} placeholder="자녀 아이디를 입력해주세요" />
                            : <input class="regiinput" style={{ borderColor:"red"}} value={studentidinput} onChange={(e)=>setStudentidinput(e.target.value)} placeholder="자녀 아이디를 입력해주세요" />}
                        </div>
                        <br/>  
                        
                        {/* 자녀 이름 자동 출력칸 */}
                        <div class="divflex">
                        <h5 class="regitag">이름</h5>
                        {studentnameresult === ""
                            ? <input class="regiinput" value="" placeholder='올바른 아이디를 입력해주세요' readOnly="readOnly" />
                            : <input class="regiinput" value={studentnameresult} style={{  color:'blue' }} readOnly="readOnly" />}
                        </div>
                        <br/>
                        <button class="regibtn" onClick={studentadd}>추가</button>
                        <br/>
    
                        {/* 자녀 선택 */}
                        <div class="divflex">
                        <table border="1" className="tabletwo table table-hover">
                            <colgroup>
                                <col width="50" /><col width="50" /><col width="200" /><col width="100" />
                            </colgroup>
                            <thead>
                                <tr>
                                    <th>선택</th><th>번호</th><th>자녀아이디</th><th>자녀이름</th>
                                </tr>
                            </thead>
                            <tbody className="subplus2" id="subplus2">
                                <tr>
                                    <td colSpan="4">자녀를 추가해주세요</td>
                                </tr>
                            </tbody>
                        </table>
                        </div>

                        
                        {/* 아이디 입력칸 */}
                        <div class="divflex">
                        <h5 class="regitag">아이디</h5>
                        {ida === true
                                ? <input class="regiinput"  value={id} onChange={idChange} placeholder="영문자와 숫자로 6자 이상" />
                                : <input class="regiinput"  style={{ borderColor: "red" }} value={id} onChange={idChange} placeholder="영문자와 숫자로 6자 이상" />}
                        </div>
                        {id.length > 0
                        ?<div> 
                            {idc === "이 아이디는 사용할 수 있습니다" 
                            ? <div class="checkdiv" style={{ fontSize: "5px", color: 'blue' }}>{idc}</div>
                            : <div class="checkdiv" style={{ fontSize: "5px", color: 'red' }}>{idc}</div>}</div>
                        :<div></div>}
                        
                        <br/>
                        
                        {/* 비밀번호 입력칸 */}
                        <div class="divflex">
                        <h5 class="regitag">비밀번호</h5>
                        {passworda === true
                                ? <input type="password" class="regiinput" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="숫자,영문자,특수문자 포함 8자 이상" />
                                : <input type="password" class="regiinput" style={{ borderColor: "red"}} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="숫자,영문자,특수문자 포함 8자 이상" />}
                        </div>
                        {password.length > 0
                        ?<div> 
                            {passwordc === "안전한 비밀번호 입니다"
                            ? <div class="checkdiv" style={{ fontSize: "5px", color: 'blue' }}>{passwordc}</div>
                            : <div class="checkdiv" style={{ fontSize: "5px", color: 'red' }}>{passwordc}</div>}</div>
                        :<div></div>}
                         <br/>
                        
                        {/* 비밀번호 확인 입력칸 */}
                        <div class="divflex">
                        <h5 class="regitag">비밀번호 확인</h5>
                        {passwordChecka === true
                            ? <input type="password" class="regiinput" value={passwordcheck} onChange={(e) => setPasswordcheck(e.target.value)} placeholder="위와 동일한 비밀번호 입력" />
                            : <input type="password" class="regiinput" style={{ borderColor: "red"}} value={passwordcheck} onChange={(e) => setPasswordcheck(e.target.value)} placeholder="위와 동일한 비밀번호 입력" />}
                        </div>
                        {passwordcheck.length > 0
                        ?<div> 
                             {passwordcheckc === "비밀번호가 동일합니다"
                            ? <div class="checkdiv" style={{ fontSize: "5px", color: 'blue' }}>{passwordcheckc}</div>
                            : <div class="checkdiv" style={{ fontSize: "5px", color: 'red' }}>{passwordcheckc}</div>}</div>
                        :<div></div>}
                         <br/>

                        {/* 비밀번호 확인 입력칸 */}
                        <div class="divflex">
                        <h5 class="regitag">이메일 주소</h5>
                        {emaila === true
                            ? <input class="regiinput"  value={email} onChange={(e) => setEmail(e.target.value)} placeholder="이메일 주소를 입력해주세요" />
                            : <input class="regiinput" style={{ borderColor: "red"}} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="이메일 주소를 입력해주세요" />}
                        </div>
                        {email.length>0
                        ?<div> 
                            {emailc === "형식에 맞는 이메일입니다"
                            ? <div class="checkdiv" style={{ fontSize: "5px", color: 'blue' }}>{emailc}</div>
                            : <div class="checkdiv" style={{ fontSize: "5px", color: 'red' }}>{emailc}</div>}</div>
                        :<div></div>}
                        <br/>
                        
                        {/* 생년월일 입력칸 */}
                        <div class="divflex">
                        <h5 class="regitag">생년월일</h5>
                        {birtha === true
                            ? <input class="regiinput" value={birth} onChange={(e) => setBirth(e.target.value)} placeholder="주민번호 앞자리 6자로 입력해주세요" />
                            : <input class="regiinput" style={{ borderColor: "red" }} value={birth} onChange={(e) => setBirth(e.target.value)} placeholder="주민번호 앞자리 6자로 입력해주세요" />}
                        </div>
                        {birth.length>0
                        ?<div> 
                             {birthc === "올바르게 입력되었습니다"
                            ? <div class="checkdiv" style={{ fontSize: "5px", color: 'blue' }}>{birthc}</div>
                            : <div class="checkdiv" style={{ fontSize: "5px", color: 'red' }}>{birthc}</div>}</div>
                        :<div></div>}
                        <br/>
                       
                        {/* 주소 입력칸 */}
                        <div class="divflex">
                        <h5 class="regitag">주소</h5>
                        {addressa === true
                            ? <input class="regiinput" placeholder="주소검색을 클릭해주세요" type="text" required={true}  value={enroll_company.address} />
                            : <input class="regiinput" style={{ borderColor: "red"}}  placeholder="주소검색을 클릭해주세요" type="text" required={true} value={enroll_company.address} />}
                        </div>
                        <br/>
                        <div>
                            <React.Fragment>
                                <button class="regibtn" onClick={openModal}>주소검색</button>
                                <Modal open={modalOpen} close={closeModal} header="주소검색 ">
                                    <main>
                                        <br />
                                        <Post onClose={setPopup} setModalClose={setModalOpen} company={enroll_company} setcompany={setEnroll_company}></Post>
                                    </main>

                                </Modal>
                            </React.Fragment>
                        </div>
                        <br/><br/>
                        
                        {/* 사진 찍는칸 */}
                        <h5 style={{fontWeight:"bold"}}>사진찍기</h5>   
                        <div>
                        {photostart === true
                            ?
                            <div>
                                {photoa === true 
                                ?  <button class="photobtn" onClick={startCapture}>다시 찍기</button>
                                :  <button class="photobtn" style={{ borderColor:'red' }} onClick={startCapture}>카메라 열기</button>}
                                &nbsp;&nbsp;
                                <button class="photobtn" onClick={captureImage} disabled={!mediaStream}>
                                    사진 찍기
                                </button>
                                <div style={{ display: captured ? 'none' : 'block' }}>
                                    <video ref={videoRef} autoPlay width={300} height={260} />
                                </div>
                                {captured && (
                                    <div style={{ display: captured ? 'block' : 'none' }}>
                                    <img src={URL.createObjectURL(imageSrc)} alt="captured image" width={300} height={220}  />
                                    </div>
                                )}
                            
                            </div>
                            : 
                            <div>
                                <img src={camera} width="100" height="100"/>
                                &nbsp;&nbsp;
                                <button class="photobtn" onClick={startCapture}>사진찍기</button>    
                            </div>
                        }
                        </div>
                        <br/>
                     
                        {/* 휴대폰 번호 입력칸 */}
                        <div class="divflex">
                        <h5 class="regitag">번호</h5>
                        {phonea === true
                            ? <input class="regiinput" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="휴대폰 번호를 입력해주세요" />
                            : <input class="regiinput" style={{ borderColor: "red" }} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="휴대폰 번호를 입력해주세요" />}
                        </div>
                        {phone.length > 0
                        ?<div> 
                             {phonec === "올바르게 입력되었습니다"
                                ?<div class="checkdiv" style={{ fontSize: "5px", color: 'blue' }}>{phonec}</div>
                                :<div class="checkdiv" style={{ fontSize: "5px", color: 'red' }}>{phonec}</div>}
                         </div>
                        :<div></div>}
                        

                        <br/>
                        {phonec === "올바르게 입력되었습니다"
                        ?<button class="regibtn" onClick={sendPhone}>인증번호 발송</button>
                        :<button class="regibtnfalse" disabled="false" onClick={sendPhone}>인증번호 발송</button>}
                        <br/><br/>
                        
                        {/* 휴대폰 인증 번호 입력칸 */}
                        <div class="divflex">
                        <h5 class="regitag">인증번호</h5>
                        {phone_publica === true
                            ? <input class="regiinput" value={phone_public} onChange={(e) => setPhone_public(e.target.value)} placeholder="인증번호를 입력해주세요" />
                            : <input class="regiinput" style={{ borderColor: "red"}} value={phone_public} onChange={(e) => setPhone_public(e.target.value)} placeholder="인증번호를 입력해주세요" />}
                        </div>
                        {phone_publiccheck === "인증 완료되었습니다"
                            ? <div class="checkdiv" style={{ fontSize: "5px", color: 'blue' }}>{phone_publiccheck}</div>
                            : <div class="checkdiv" style={{ fontSize: "5px", color: 'red' }}>{phone_publiccheck}</div>}
                        <br/>
                        {phone_publicch === true
                            ? <div><button class="regibtn" onClick={sendphonecheck}>인증하기</button></div>
                            : <div><button class="regibtn" disabled="false" onClick={sendphonecheck}>인증하기</button></div>}
                        
                        <br/><br/>
                        
                    </div>

                    <div>
                        <button class="btn2" onClick={regiselect}>가입유형선택</button>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <button class="btn2" onClick={account}>회원가입</button>
                    </div> 
                    <br/><br/>   
                </div>
            </div>
            
        </div>
    )
}

export default RegiParents;