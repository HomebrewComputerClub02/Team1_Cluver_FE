import styled from "styled-components";
import Navbar from "../../components/Navbar";
import Bottombar from "../../components/Bottombar";
import { useRef, useState, useEffect } from "react";
import Calendar from "react-calendar";
import "../../../node_modules/react-calendar/dist/Calendar.css";
import moment from "moment";
import "./Calendar.css";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  BASE_URL,
  doCheck,
  codeCheck,
  getClubAttendance,
  getCalendar,
} from "../../util/api";
import * as S from "./Attendance.styled";

function Attendance() {
  const params = useParams();

  let arr = [
    {
      user_name: "",
      code: "",
      attendances: [] as any,
      username: "",
      usercode: "",
    },
  ];

  const box = useRef<any>([]);
  const [code, setCode] = useState("");
  const [ch, setCh] = useState("login");
  const [name, setName] = useState("");
  const [birth, setBirth] = useState("");
  const success = useRef<any>();
  const fail = useRef<any>();
  const or = useRef<any>([]);
  const [a, setArr] = useState(arr);
  const [date, setDate] = useState<any>();
  const [fmDate, setFmDate] = useState(date);
  const pick = useRef<any>();
  let resAPI = [] as any;
  const clovers = useRef<any>([]);
  const [act, setAct] = useState("");
  const [num, setNum] = useState(0);
  const [message, setM] = useState("유효하지 않은 출석 코드입니다.");
  const [message2, setM2] = useState("다시 입력해주세요.");
  const [b, setArr2] = useState(arr);

  let N = 0;

  const key = "1234";
  const today = moment().format("YYYY-MM-DD");

  useEffect(() => {
    if (code !== key) {
      setCh("login");
    }
    if (code === "") {
      box.current[0].style.border = "1px solid white";
    } else {
      box.current[0].style.border = "1px solid transparent";
    }
  }, [code]);

  useEffect(() => {
    if (name === "") {
      box.current[1].style.border = "1px solid white";
    } else {
      box.current[1].style.border = "1px solid transparent";
    }
  }, [name]);

  useEffect(() => {
    if (birth === "") {
      box.current[2].style.border = "1px solid white";
    } else {
      box.current[2].style.border = "1px solid transparent";
    }
  }, [birth]);

  const getAttendance = async (m: string, d: string) => {
    const response = await getClubAttendance(m, d, Number(params.clubID));
    //console.log(response);
    setAct(response.activity);
    setNum(response.checkNum);
  };

  const getUsers = async (m: string, d: string) => {
    const response = await getCalendar(m, d, Number(params.clubID));
    //console.log(response);
    setArr2(response);
  };

  useEffect(() => {
    let fmDate = moment(date).format("YYYY-MM-DD");
    const m = moment(date).format("M");
    const d = moment(date).format("D");
    setFmDate(fmDate);
    getAttendance(m, d);
    getUsers(m, d);
    setTimeout(() => {
      pick.current.style.opacity = "1";
      pick.current.style.zIndex = "3";
    }, 100);
  }, [date]);

  const [flag, setF] = useState<any>(0);
  /* const url = "http://172.20.10.4:8000/club/" + params.userID;
  axios.get(url).then(function (response) {
    resAPI = response.data;
  }); */

  const Api = async () => {
    try {
      const url = BASE_URL + "/club/" + params.clubID;
      //const url = "http://172.20.10.4:8000/club/" + params.userID;
      const response = await axios.get(url);
      resAPI = response.data;
      //console.log(resAPI);
      setArr(resAPI.users);
      if (resAPI.users) {
        setF(1);
      } else {
        console.log("2");
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    Api();
    setArr(resAPI.users);
    if (a.length > 0) {
      a.forEach((e) => {
        //console.log(e.attendances);
      });
    } else {
      console.log("yet");
    }
  }, [flag]);

  const month = moment().format("M");
  const day = moment().format("D");
  const docheck = async () => {
    const response = await doCheck(
      month,
      day,
      Number(params.clubID),
      name,
      birth
    );
    //console.log("docheck");
    //console.log(response);
  };

  const chCode = async () => {
    const response = await codeCheck(month, day, Number(params.clubID), code);
    //console.log(response);
    switch (response) {
      case "해당 club_attendance 없음":
        //console.log(1);
        setM("생성된 출석 코드가 없습니다.");
        setM2("동아리 관리자에게 문의해주세요.");
        return 1;
      case "출석 성공":
        //console.log(2);
        setM("인증되었습니다.");
        setM2("");
        return 2;
      case "출석코드가 다름":
        //console.log(3);
        setM("유효하지 않은 출석 코드입니다.");
        setM2("다시 입력해주세요.");
        return 3;
    }
  };

  return (
    <>
      <S.Wrap>
        <S.Bg>
          <Navbar />
          <S.Date>{today}</S.Date>
          <S.Text>출석 코드를 입력하세요</S.Text>
          <S.CodeBox
            ref={(e) => {
              box.current[0] = e;
            }}
          >
            <S.Code
              type="text"
              placeholder="CODE"
              onChange={(e) => {
                setCode(e.target.value);
              }}
            ></S.Code>
            <span
              className="material-symbols-outlined"
              style={{
                color: "white",
                fontVariationSettings: "'wght' 300",
                position: "absolute",
                top: "170px",
                left: "225px",
                cursor: "pointer",
              }}
              onClick={async () => {
                const res = await chCode();
                if (res === 2) {
                  setCh("done");
                  success.current.style.opacity = "1";
                  success.current.style.zIndex = "10";
                } else {
                  fail.current.style.opacity = "1";
                  fail.current.style.zIndex = "10";
                  setTimeout(() => {
                    fail.current.style.opacity = "0";
                    fail.current.style.zIndex = "-1";
                  }, 1800);
                }
              }}
            >
              {ch}
            </span>
          </S.CodeBox>
          <S.InputDiv ref={success}>
            <S.InputText>
              {/* 인증되었습니다. */}
              {message}
            </S.InputText>
            <S.InputBox
              ref={(e) => {
                box.current[1] = e;
              }}
            >
              <S.Input
                type="text"
                placeholder="이름"
                onChange={(e) => {
                  setName(e.target.value);
                }}
              ></S.Input>
            </S.InputBox>
            <S.InputBox
              ref={(e) => {
                box.current[2] = e;
              }}
            >
              <S.Input
                type="text"
                maxLength={4}
                placeholder="생일 4자리"
                onChange={(e) => {
                  setBirth(e.target.value);
                }}
              ></S.Input>
            </S.InputBox>
            <S.Btn
              ref={(e) => {
                box.current[3] = e;
              }}
              onMouseEnter={() => {
                if (name !== "" && birth !== "") {
                  box.current[3].style.background =
                    "linear-gradient(135deg, #89ec84 0%, #abc0e4 55%, #abc0e4 83%, #c7d5ed 100%)";
                } else {
                  box.current[3].style.background = "white";
                }
              }}
              onMouseLeave={() => {
                box.current[3].style.background = "white";
              }}
              onClick={() => {
                //console.log(name, birth);
                if (
                  window.confirm(`[${name} ${birth}] 입력하신 정보가 맞습니까?`)
                ) {
                  doCheck(month, day, Number(params.clubID), name, birth);
                  setTimeout(() => {
                    success.current.style.opacity = "0";
                    success.current.style.zIndex = "-1";
                  }, 200);
                  window.location.href = `/attendance/${params.clubID}`;
                } else {
                  setTimeout(() => {
                    success.current.style.opacity = "0";
                    success.current.style.zIndex = "-1";
                  }, 100);
                }
              }}
            >
              출석체크
            </S.Btn>
          </S.InputDiv>
          <S.FailDiv ref={fail}>
            <S.InputText style={{ marginTop: "20px" }}>
              {/* 유효하지 않은 출석 코드입니다. */}
              {message}
            </S.InputText>
            <S.InputText style={{ marginTop: "0" }}>
              {message2}
              {/* 다시 입력해주세요. */}
            </S.InputText>
          </S.FailDiv>
          <S.ChooseDiv>
            <S.Ch
              ref={(e) => {
                or.current[0] = e;
              }}
              style={{ color: "#89EC84" }}
              onClick={() => {
                or.current[0].style.color = "#89EC84";
                or.current[1].style.color = "white";
                or.current[2].style.opacity = "1";
                or.current[3].style.opacity = "0";
                or.current[4].style.zIndex = "-1";
              }}
            >
              명단으로 보기
            </S.Ch>
            <S.Division>|</S.Division>
            <S.Ch
              ref={(e) => {
                or.current[1] = e;
              }}
              onClick={() => {
                or.current[1].style.color = "#89EC84";
                or.current[0].style.color = "white";
                or.current[3].style.opacity = "1";
                or.current[2].style.opacity = "0";
              }}
            >
              캘린더로 보기
            </S.Ch>
          </S.ChooseDiv>
          <S.Section
            ref={(e) => {
              or.current[2] = e;
            }}
            style={{ opacity: "1" }}
          >
            <ul>
              {a?.map((e: any) => {
                N = 0;
                let div = 1;
                let ct = 0;
                let per = Math.round((ct / e.attendances.length) * 100);
                let navDiv = [] as any;
                navDiv[`${e.id}`] = 0;
                return (
                  <li key={e.index}>
                    <S.MemberDiv>
                      <S.MemberText
                        style={{
                          marginLeft: "7px",
                          width: "50px",
                        }}
                      >
                        {e.user_name}
                      </S.MemberText>
                      <S.MemberText style={{ marginRight: "5px" }}>
                        {e.code}
                      </S.MemberText>
                      <S.MemberText
                        style={{
                          width: "21px",
                          zIndex: "3",
                        }}
                      >
                        <span
                          className="material-symbols-outlined"
                          style={{
                            fontSize: "22px",
                            lineHeight: "12px",
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            if (navDiv[`${e.id}`] > 0) {
                              navDiv[`${e.id}`] -= 1;
                            }
                            //console.log(navDiv[`${e.id}`]);
                            let how = navDiv[`${e.id}`] * 83.2;
                            clovers.current[
                              `${e.id}`
                            ].style.transform = `translateX(-${how}px)`;
                          }}
                        >
                          navigate_before
                        </span>
                      </S.MemberText>
                      <S.MemberText
                        style={{
                          width: "81.5px",
                          marginLeft: "0",
                          color: "grey",
                          fontFamily: "copperplate",
                          fontSize: "17px",
                          paddingTop: "7px",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          ref={(ele) => {
                            clovers.current[`${e.id}`] = ele;
                          }}
                          style={{ width: "fit-content" }}
                        >
                          {e.attendances?.map((i: any) => {
                            N += 1;
                            div = N / 5;
                            /* if (N % 5 !== 0) {
                              div += 1;
                            } */
                            if (i.isChecked === true) {
                              ct++;
                              per = Math.round(
                                (ct / e.attendances.length) * 100
                              );
                              return (
                                <span
                                  style={{
                                    cursor: "pointer",
                                    marginRight: "5px",
                                    color: "#9ee69a",
                                  }}
                                  onClick={() => {
                                    alert(`${i.club_attendance.date}`);
                                  }}
                                >
                                  ♣
                                </span>
                              );
                            } else {
                              per = Math.round(
                                (ct / e.attendances.length) * 100
                              );
                              return (
                                <span
                                  style={{
                                    cursor: "pointer",
                                    marginRight: "5px",
                                    color: "grey",
                                  }}
                                  onClick={() => {
                                    alert(`${i.club_attendance.date}`);
                                  }}
                                >
                                  ♣
                                </span>
                              );
                            }
                          })}
                        </div>
                      </S.MemberText>
                      <S.MemberText
                        style={{
                          width: "18px",
                          marginLeft: "0",
                          marginRight: "10px",
                        }}
                      >
                        <span
                          className="material-symbols-outlined"
                          style={{
                            fontSize: "22px",
                            lineHeight: "12px",
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            if (navDiv[`${e.id}`] < div - 1) {
                              navDiv[`${e.id}`] += 1;
                            }
                            //console.log(navDiv[`${e.id}`]);
                            let how = navDiv[`${e.id}`] * 83.2;
                            clovers.current[
                              `${e.id}`
                            ].style.transform = `translateX(-${how}px)`;
                          }}
                        >
                          navigate_next
                        </span>
                      </S.MemberText>
                      <S.MemberText style={{ width: "50px" }}>
                        <S.BarArea>
                          <S.Bar
                            style={{
                              width: `${per}%`,
                            }}
                          ></S.Bar>
                        </S.BarArea>
                      </S.MemberText>
                      <S.MemberText style={{ textAlign: "right" }}>
                        {per} %
                      </S.MemberText>
                    </S.MemberDiv>
                  </li>
                );
              })}
            </ul>
          </S.Section>
          <S.Section
            ref={(e) => {
              or.current[3] = e;
            }}
            style={{ opacity: "0", zIndex: "0" }}
          >
            <Calendar
              className="react-calendar"
              calendarType="US"
              minDetail="month"
              maxDetail="month"
              next2Label={null}
              prev2Label={null}
              formatDay={(locale, date) => moment(date).format("D")}
              onChange={setDate}
              value={date}
            ></Calendar>
            <S.PickDiv ref={pick}>
              <S.InputText style={{ margin: "20px auto 0" }}>
                {fmDate}
              </S.InputText>
              <S.InputText
                style={{
                  marginTop: "10px",
                  marginLeft: "53px",
                  marginBottom: "0",
                }}
              >
                활동 내용 : {act}
              </S.InputText>
              <S.InputText
                style={{
                  marginTop: "7px",
                  marginLeft: "53px",
                }}
              >
                출석 인원 : {num}{" "}
                <S.PickBtn
                  onClick={() => {
                    or.current[4].style.opacity = "1";
                    or.current[4].style.zIndex = "3";
                  }}
                >
                  출석부
                </S.PickBtn>
              </S.InputText>
              <S.InputText
                style={{
                  margin: "2px auto",
                }}
                onClick={() => {
                  pick.current.style.opacity = "0";
                  pick.current.style.zIndex = "-3";
                }}
              >
                <S.PickBtn style={{ marginLeft: "0" }}>닫기</S.PickBtn>
              </S.InputText>
            </S.PickDiv>
          </S.Section>
          <S.Section
            ref={(e) => {
              or.current[4] = e;
            }}
            style={{ background: "transparent", zIndex: "-3" }}
          >
            <S.listDiv
            /* style={{
                opacity: "0",
                zIndex: "-1",
              }} */
            >
              <ul>
                {b &&
                  b?.map((e: any) => {
                    return (
                      <li key={e.index}>
                        <S.MemberDiv>
                          <S.MemberText
                            style={{
                              marginLeft: "7px",
                              width: "50px",
                            }}
                          >
                            {e.username}
                          </S.MemberText>
                          <S.MemberText style={{ marginRight: "5px" }}>
                            {e.usercode}
                          </S.MemberText>
                        </S.MemberDiv>
                      </li>
                    );
                  })}
              </ul>
              <S.PickBtn
                style={{ margin: "10px", marginBottom: "20px" }}
                onClick={() => {
                  or.current[4].style.opacity = "0";
                  or.current[4].style.zIndex = "-1";
                }}
              >
                닫기
              </S.PickBtn>
            </S.listDiv>
          </S.Section>
          <Bottombar
            first={true}
            second={false}
            third={false}
            fourth={false}
            fifth={false}
          />
        </S.Bg>
      </S.Wrap>
    </>
  );
}

export default Attendance;
