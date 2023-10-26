import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { data } from 'autoprefixer';
import { error } from 'console';

interface trackingDetail{
  kind: "string";
  level: number;
  manName: "string";
  manPic: "string";
  telno: "string";
  telno2: "string";
  time: "number";
  timeString: "number";
  where: "string";
  code: null;
  remark: null;
  // code - 스트링 or null / remark - string dr - null
}

interface PackageData{
  "adUrl": "string",
  "complete": true,
  "invoiceNo": "number",
  "itemImage": "",
  "itemName": "MG2304PT02OTXS",
  "level": 6,
  "receiverAddr": "",
  "receiverName": "",
  "recipient": "",
  "result": "number",
  "senderName": "string",
  "trackingDetails": trackingDetail[],
  "orderNumber": string | null,
  "estimate": string | null,
  "productInfo": string | null,
  "zipCode": string | null,
  "lastDetail": trackingDetail,
  "lastStateDetail": trackingDetail,
  "firstDetail" : trackingDetail,
  "completeYN": ""
}

interface Company {
  
   International: string;
   Code: string;
   Name: string;
}
interface themeColor {
  [key: string] : {
    back: string;
    hover: string;
    active: string;
    text: string;
    outline: string;

    odd: string;
    after: string;
    border: string;
    rgb: string;
  }
}
interface ButtonType {
  name: string;
  theme: string;

}


function App() {

const [carriers, setCarriers] = useState<Company[]>([]);
const [allCarrlers, setAllcarriers] = useState<Company[]>([]);
const [theme, setTheme] = useState<string>('default');

const [tcode, setTcode] = useState<string>('04');
const [tinvoice, setTinvoce] = useState<string>('');
const [tname, setTname] = useState<string>('CJ대한통운');
const [isBtn, setIsBtn] = useState<number | null>(null);
const [infoTracking, setInfoTracking] = useState<PackageData | null>(null);

const [isLoading, setIsLoading] = useState<boolean>(true);
const [isShow, setIsShow] = useState<boolean>(false);
const [error, setError] = useState<string>('');

const themeColor :themeColor = {
  "default":{
    "back": "bg-indigo-500",
    "hover": "hover:bg-indigo-300",
    "active": "bg-indigo-400",
    "text": "text-indigo-500",
    "outline" : "outline-indigo-300",
    "odd" : "odd:bg-indigo-50",
    "after" : "after:bg-indigo-500",
    "border" : "border-indigo-300",
    "rgb" : "#6366f1"
  },
  "orange":{
    "back": "bg-orange-500",
    "hover": "hover:bg-orange-300",
    "active": "bg-orange-400",
    "text": "text-orange-500",
    "outline" : "outline-orange-300",
    "odd" : "odd:bg-orange-50",
    "after" : "after:bg-orange-500",
    "border" : "border-orange-300",
    "rgb" : "#f97326"
  },
  "pink":{
    "back": "bg-[#FFEAEE]",
    "hover": "hover:bg-[#FFEAEE]",
    "active": "bg-[#FFEAEE]",
    "text": "text-[#f18ea1]",
    "outline" : "outline-[#FFEAEE]",
    "odd" : "odd:bg-[#FFEAEE]",
    "after" : "after:bg-[#FFEAEE]",
    "border" : "border-[#FFEAEE]",
    "rgb" : "#FFEAEE"
    // "rgb" : "#3b82f6"
  }
}

const buttons :ButtonType[] = [
  {name: "기본", theme: "default"},
  {name: "오렌지", theme: "orange"},
  {name: "핑크", theme: "pink"},
]

useEffect(()=>{
  const fetchData = async () =>{
    setIsLoading(!isLoading);
    try{
      const res = await fetch(`
      https://info.sweettracker.co.kr/api/v1/companylist?t_key=${process.env.REACT_APP_API_KEY}`)
      const data = await res.json();
       console.log(data)
       setCarriers(data.Company);
       setAllcarriers(data.Company);
       setIsLoading(false);

    }catch(error){
      console.log(error);
    }
  }

  fetchData()
},[])


const selectcode = (BtnNumber: number, code : string, name : string)=>{
  setIsBtn(BtnNumber);
  setTcode(code);
  setTname(name);


  const isInternational = BtnNumber === 2 ? 'true' : 'false';
  
  const filterCarriers = allCarrlers.filter(e => e.International === isInternational);
  setCarriers(filterCarriers)
}

const blindNumber = (e: React.ChangeEvent<HTMLInputElement>)=>{
  const value = e.target.value;
  const result = carriers.find((e)=> e.Code === tcode)
  if(result?.International === "false"){
    e.target.value = e.target.value.replace(/[^0-9]/g,'')
  }
  setTinvoce(value);
}
// 조회하기
const postsubmit = async ()=>{
  setIsLoading(true);
  setIsShow(false);
  setError('')
  // const url = new URL(`http://info.sweettracker.co.kr/api/v1/trackingInfo?t_invoice=406400763145&t_code=08&t_key=0b0EZTmRVNRf9lGpwtx1yw`)


  // const url = new URL(`"http://info.sweettracker.co.kr/api/v1/trackingInfo"`);
  // url.searchParams.append("t_code", tcode);
  // url.searchParams.append("t_invcoice", tinvoice);
  // url.searchParams.append("t_key", `$process.env.REACT_APP_API_KEY`);


  try{

    const res = await fetch(`http://info.sweettracker.co.kr/api/v1/trackingInfo?t_invoice=${tinvoice}&t_code=${tcode}&t_key=${process.env.REACT_APP_API_KEY}`);
    const data = await res.json();
    if(data.firstDetail === null){
      setError("데이터 없음");
      setIsLoading(false);
      return;
    }
    if(data.code === '104' || data.code === '105'){
      setError(data.msg);
     
    }else{
      
      setInfoTracking(data);
      
    }
    setIsLoading(false);

    console.log(data)

  }catch(error){
    console.log(error);
  }
  // console.log(tcode, tinvoice)
}

const postListName :string[] = ["상품인수", "상품이동중", "배송지도착", "배송출발", "배송완료"];

  return (
    <>
    {
      isLoading && 
      <div className="ficed w-full h-full bg-black/50 top-0 left-0 z-50">
        <div className="absolute left-2/4 top-2/4 translate-x-2/4 translate-y-2/4">
        <svg width="200px" height="200px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
<g transform="rotate(0 50 50)">
  <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill={`${themeColor[theme].rgb}`}>
    <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.9166666666666666s" repeatCount="indefinite"></animate>
  </rect>
</g><g transform="rotate(30 50 50)">
  <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill={`${themeColor[theme].rgb}`}>
    <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.8333333333333334s" repeatCount="indefinite"></animate>
  </rect>
</g><g transform="rotate(60 50 50)">
  <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill={`${themeColor[theme].rgb}`}>
    <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.75s" repeatCount="indefinite"></animate>
  </rect>
</g><g transform="rotate(90 50 50)">
  <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill={`${themeColor[theme].rgb}`}>
    <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.6666666666666666s" repeatCount="indefinite"></animate>
  </rect>
</g><g transform="rotate(120 50 50)">
  <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill={`${themeColor[theme].rgb}`}>
    <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.5833333333333334s" repeatCount="indefinite"></animate>
  </rect>
</g><g transform="rotate(150 50 50)">
  <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill={`${themeColor[theme].rgb}`}>
    <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.5s" repeatCount="indefinite"></animate>
  </rect>
</g><g transform="rotate(180 50 50)">
  <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill={`${themeColor[theme].rgb}`}>
    <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.4166666666666667s" repeatCount="indefinite"></animate>
  </rect>
</g><g transform="rotate(210 50 50)">
  <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill={`${themeColor[theme].rgb}`}>
    <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.3333333333333333s" repeatCount="indefinite"></animate>
  </rect>
</g><g transform="rotate(240 50 50)">
  <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill={`${themeColor[theme].rgb}`}>
    <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.25s" repeatCount="indefinite"></animate>
  </rect>
</g><g transform="rotate(270 50 50)">
  <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill={`${themeColor[theme].rgb}`}>
    <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.16666666666666666s" repeatCount="indefinite"></animate>
  </rect>
</g><g transform="rotate(300 50 50)">
  <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill={`${themeColor[theme].rgb}`}>
    <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.08333333333333333s" repeatCount="indefinite"></animate>
  </rect>
</g><g transform="rotate(330 50 50)">
  <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill={`${themeColor[theme].rgb}`}>
    <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="0s" repeatCount="indefinite"></animate>
  </rect>
</g>
</svg>
        </div>
      </div>

    }
    <div className={`${themeColor[theme].back} p-5 text-black 
    text-sm md:text-xl xl:text-2xl flex justfy-between`}>
   <h3 className='font-extrabold'>국내,외 택배조회 시스템</h3>
    <div>
      <span>테마 :</span>
      {
        buttons.map((e,i)=>{
          return(
            <button onClick={()=> setTheme(e.theme)} key={i} className="mx-l md:mx-2 xl:mx-3">{e.name}</button>
          )
        })
      }
      </div>
    </div>

    <div className="w-4/5 md:w-3/5 xl:w-4/12 mx-auto my-40 flex rounded items-center flex-wrap">
  <div className="border-b basis-full py-2 flex justify-center items-center text-sm">
  <span className='basis-[30%] text-center mr-5'>국내 / 국외 선택</span>
  <button className={`text-sm border p-1 px-5 rounded hover:text-white mr-4
   ${isBtn === 1 ? 'text-white' : 'text-black'}
    ${themeColor[theme].hover} ${isBtn === 1 ? themeColor[theme].active: ''}`} onClick={()=>{ selectcode(1, '04', 'cj대한통운')}}>국내</button>
  <button className={`text-sm border p-1 px-5 rounded hover:text-white mr-4
   ${isBtn === 2 ? 'text-white' : 'text-black'} 
   ${themeColor[theme].hover} ${isBtn === 2 ? themeColor[theme].active: ''}`} onClick={()=>{ selectcode(2, '12', 'EMS')}}>국외</button>
</div>

<div className="basis-full pt-4 border-b ">
<select className='w-full' value={tcode}  onChange={(e)=>{
  const result_code = e.target.value;
  setTcode(e.target.value);
  const result = carriers.find((e)=> e.Code === result_code);
  if(result){
    setTname(result.Name);
  }
}}>
 {
  carriers.map((e,i)=>{
    return(
      <option key={i} value={e.Code}>{e.Name}</option>
    )
  })
 }
</select>
</div>


<div className="basis-full py-4 border-b text-center">
  <input type="text" onInput={blindNumber} placeholder='운송장 번호를 입력해주세요' className='w-full border px-5 py-2 rounded-md {themColor[them].outline}' />
</div>

<div className="basis-full border-b py-4 text-center">
  <button className={`${themeColor[theme].back} text-white px-5 py-2 rounded-md w-full`} onClick={postsubmit}>조회하기</button>
  </div>
</div>

      {
        error &&
        <div className="basis-full text-center py-4 border-b">
        <span className={`${themeColor[theme].text} font-bold`}>{error}</span>
        </div>
      }

      {
        isShow &&
        <>
        <div className="w-full">
          <div className={`${themeColor[theme].back} text-white flex justify-center py-10 px-5 flex-wrap items-center text-center`}>
            <span className='text-xl basis-[45%] font-bold mr-5 mb-5'>운송장 번호</span>
            <h3 className='text-2xl basis-[45%] font-bold mb-5' >{tinvoice}</h3>
            <span className='text-xl basis-[45%] font-bold mr-5 mb-5'>택배사</span>
            <h3 className='text-2xl basis-[45%] font-bold mb-5' >{tname}</h3>
          </div>
        </div>

          <div className="bg-white my-5 flex justify-around py-5 relative before:absolute before:bg-[#e2e5e8] before:h-[1px] before:box-border before:top-[45%] before:left-[10%] before:w-4/5 before:z-0">
            {
              Array(5).fill('').map((_,i)=>{
                const resultLevel = infoTracking && i + 1 ===(infoTracking?.level -1);
                return(
                    <div className={`${resultLevel ? themeColor[theme].after :'after:bg-gray-200' } relative z-10 after:absolute after:w-[60px] after:h-[60px] after:rounded-full after:left-0 after:top-0`} key={i}>
                      <img className='relative z-10' src={`images/ic_sky_delivery_step${i+1}_on.png`} alt={postListName[i]} />
                    <p className='text-center text-xs mt-1'>{postListName[i]}</p>
                    {/* 레벨의 글자> 테마의색상 + 글자진하게*/}
                  </div>
                )
              })
            }
          </div>

          <div className="bg-white py-5">
            {
              infoTracking && infoTracking.trackingDetails.slice().reverse().map((e,i)=>{
                return(
                  <div className={`pl-20 py-5 relative group ${themeColor[theme].odd}`} key={i}>

                    <div className={`${ i === 0 ? `${themeColor[theme].active} ${themeColor[theme].border}` : 'bg-white'} relative w-2 h-2 rounded-full border-2 -left-[30px] top-10 z-30`}></div>

                    <p>{e.where} | {e.kind}</p>
                    <p>{e.telno}</p>
                    <p>{e.timeString}</p>
                    <div className={`group-last:h-0 h-full absolute w-0.5 left-[53px] top-[60px] z-20 ${themeColor[theme].back}`}></div>
                  </div>

                 /*  infoTracking.trackingDetails.length = 5
                 반복문을 통해서 1 값이 증감
                  현재 0번부터 시작하기 떄문에 - 1
                첫번째 5 - 0 - 1 = 4
                두번째 5 - 1 - 1 = 3
                세번째 5 - 2 - 1 = 2
                네번째 5 - 3 - 1 = 1
                ㄴ다섯번째 5 - 4 - 1 = 0
              */
             

                )
              })
            }
          </div>
        </>
      }

    </>
  );
}

export default App;
