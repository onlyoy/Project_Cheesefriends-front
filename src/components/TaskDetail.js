import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from 'axios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheese } from "@fortawesome/free-solid-svg-icons";
import './asset/css/LectureDetail.css';

function TaskDetail(){
    const [taskDetail, setTaskDetail] = useState([]);
    let history = useNavigate();

    const [bbs, setBbs] = useState();

    // 데이터를 모두 읽어 들일 때까지 rendering을 조절하는 변수
    const [loading, setLoading] = useState(false);

    let params = useParams();
    console.log(params);
    console.log(params.seq);

    function getTaskDetail(seq) {
        axios.get("http://localhost:3000/getTask", { params:{"seq":seq} })
        .then(function(resp){
            console.log(resp.data);
            setTaskDetail(resp.data);
        })
        .catch(function(err){
            alert(err);
        })
        
    }

    useEffect(function(){
        getTaskDetail(params.seq);
    },[params.seq]);

    const bbsData = async(seq) => {
        const response = await axios.get('http://localhost:3000/getTask', { params:{"seq":seq} });

        console.log("bbs:" + JSON.stringify(response.data));
        setBbs(response.data);

        setLoading(true);   // 여기서 rendering 해 준다
    }

    useEffect(()=>{
        bbsData(params.seq);
    }, [params.seq])

    if(loading === false){
        return <div>Loading...</div>
    }
    
    const tasklist = () => {        
        history('/cheesefriends/learning/TaskList');
    }

    // download
    const download = async () => {

      //  alert(JSON.stringify(bbs));

        let filename = bbs.filename;
    
        const url = "http://localhost:3000/fileDownload?filename=" + filename;
    
        window.location.href = url;
    }

    


    return (
        <div className="lecdeMain">
            <h2 className='lech2'>과제 제출실</h2>
            <table className="lectable" >
            <tbody>
            <div style={{marginLeft:"110px"}}>
            <tr style={{height:"32px"}}>
                <th style={{paddingRight:"103px"}} className="tableth">제목</th>
                <td style={{ textAlign:"left" }}>{bbs.title}</td>
            </tr>
            <tr style={{height:"32px"}}>
                <th className="tableth">과목</th>
                <td style={{ textAlign:"left" }}>{bbs.subject}</td>
            </tr>
            <tr style={{height:"32px"}}>
                <th className="tableth">작성자</th>
                <td style={{ textAlign:"left" }}>{bbs.writer}</td>
            </tr>
            <tr style={{height:"32px"}}>
                <th className="tableth">작성일</th>
                <td style={{ textAlign:"left" }}>{bbs.regdate}</td>
            </tr>
            <tr style={{height:"32px"}}>	
                <td colSpan="2" style={{ backgroundColor:'white' }}>
                <button onClick={download} style={{backgroundColor:'white', paddingTop:"10px", width:"133px", fontWeight:"bold", color:"#fbca73"}}><FontAwesomeIcon icon={faCheese} color="#fbca73" /> 첨부파일</button>
                    <pre id="content" style={{ fontSize:'20px', fontFamily:'고딕, arial', backgroundColor:'white', textAlign:"left", paddingTop:"7px" }}>{bbs.content}</pre>
                </td>
            </tr>
            </div>
            </tbody>
            </table>
            <div style={{textAlign:"center"}}>
                <button style={{width:"100px", height:"42px"}} type="button" onClick={tasklist} className="leclistBtn">목록으로</button>
            </div>
                  
        </div>
    )
}

export default TaskDetail;

