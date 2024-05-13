import React from "react";
import axios from "axios";
import { useState } from "react";
import { ChangeEventHandler } from "react";
import { MouseEventHandler } from "react";
import { FormEventHandler } from "react";
import styles from "../../../../styles/Home.module.css";
import Select from "react-select";
import Link from "next/link";
import { json } from "react-router-dom";

const initialName: string = "Unknown";

const createApiUrl = String(process.env.NEXT_PUBLIC_CREATE_API_URL);
const setApiUrl = String(process.env.NEXT_PUBLIC_SET_API_URL);
const bulkGetApiUrl = String(process.env.NEXT_PUBLIC_BULK_GET_API_URL);
const bulkSetApiUrl = String(process.env.NEXT_PUBLIC_BULK_SET_API_URL);
const getApiUrl = String(process.env.NEXT_PUBLIC_GET_API_URL);

export default function SettingName() {
  const pattern: RegExp = /^\d*\.?\d*$/;
  const [name, setName] = useState();
  const [answer1, setAnswer1] = useState("");
  const [answer2, setAnswer2] = useState("");
  const [answer3, setAnswer3] = useState("");
  const [answer4, setAnswer4] = useState("");
  const [answer5, setAnswer5] = useState("");
  const [isAnswer1, setIsAnswer1] = useState(1);
  const [isAnswer2, setIsAnswer2] = useState(1);
  const [isAnswer3, setIsAnswer3] = useState(1);
  const [isAnswer4, setIsAnswer4] = useState(1);
  const [isAnswer5, setIsAnswer5] = useState(1);
  const [status, setStatus] = useState("typing");
  const [region, setRegion] = useState("");
  const [sheetName, setSheetName] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(0);

  const handleTextareaChange1: ChangeEventHandler<HTMLTextAreaElement> = ({
    target: { value },
  }) => {
    if (!pattern.test(value)) {
      alert("半角数字(負の数，小数も可)を入力してください");
    } else {
      setIsAnswer1(1);
      setAnswer1(value);
    }
  };
  const handleTextareaChange2: ChangeEventHandler<HTMLTextAreaElement> = ({
    target: { value },
  }) => {
    if (!pattern.test(value)) {
      alert("半角数字(負の数，小数も可)を入力してください");
    } else {
      setIsAnswer2(1);
      setAnswer2(value);
    }
  };
  const handleTextareaChange3: ChangeEventHandler<HTMLTextAreaElement> = ({
    target: { value },
  }) => {
    if (!pattern.test(value)) {
      alert("半角数字(負の数，小数も可)を入力してください");
    } else {
      setIsAnswer3(1);
      setAnswer3(value);
    }
  };
  const handleTextareaChange4: ChangeEventHandler<HTMLTextAreaElement> = ({
    target: { value },
  }) => {
    if (!pattern.test(value)) {
      alert("半角数字(負の数，小数も可)を入力してください");
    } else {
      setIsAnswer4(1);
      setAnswer4(value);
    }
  };
  const handleTextareaChange5: ChangeEventHandler<HTMLTextAreaElement> = ({
    target: { value },
  }) => {
    if (!pattern.test(value)) {
      alert("半角数字(負の数，小数も可)を入力してください");
    } else {
      setIsAnswer5(1);
      setAnswer5(value);
    }
  };

  const handleCheckBoxChange1 = async () => {
    var tmp = isAnswer1;
    setIsAnswer1(1 - tmp);
  };
  const handleCheckBoxChange2 = async () => {
    var tmp = isAnswer2;
    setIsAnswer2(1 - tmp);
  };
  const handleCheckBoxChange3 = async () => {
    var tmp = isAnswer3;
    setIsAnswer3(1 - tmp);
  };
  const handleCheckBoxChange4 = async () => {
    var tmp = isAnswer4;
    setIsAnswer4(1 - tmp);
  };
  const handleCheckBoxChange5 = async () => {
    var tmp = isAnswer5;
    setIsAnswer5(1 - tmp);
  };

  interface Obj {
    [prop: string]: any; // これを記述することで、どんなプロパティでも持てるようになる
  }

  const ConfirmButtonHandler: MouseEventHandler<
    HTMLButtonElement
  > = async () => {
    var res = confirm("入札額は変更できません。本当によろしいですか？");
    if (res == true) {
      const sheetNameData = await axios.get(getApiUrl, {
        params: {
          crossDomein: true,
          sheetName: "currentGame",
          cellId: "A1",
        },
      });
      var gameName: string = sheetNameData.data;
      setSheetName(gameName);

      var startRow: number = 2;
      var startCol: number = 3;
      var values: string[][] = [[answer1, answer2, answer3, answer4, answer5]];
      var jsonValues: Obj = {};
      var isAnswers = [isAnswer1, isAnswer2, isAnswer3, isAnswer4, isAnswer5];
      for (let i = 0; i < values.length; i++) {
        jsonValues[`row${i}`] = {};
        for (let j = 0; j < values[0].length; j++) {
          jsonValues[`row${i}`][`col${j}`] = values[i][j];
          if (isAnswers[j] == 0) {
            jsonValues[`row${i}`][`col${j}`] = -9999;
          }
        }
      }
      const bulk = await axios.get(bulkSetApiUrl, {
        params: {
          crossDomein: true,
          sheetName: gameName,
          numRow: 1,
          numCol: 5,
          startRow: 5,
          startCol: 3,
          values: JSON.stringify(jsonValues),
        },
      });
      setIsSubmitted(1);

      alert("入札が無事に終了しました。結果発表をお待ち下さい。");
    } else {
      alert("ばーーか！");
    }
  };
  const NextButtonHandler: MouseEventHandler<HTMLButtonElement> = async () => {
    const data = await axios.get(getApiUrl, {
      params: {
        crossDomein: true,
        sheetName: sheetName,
        cellId: "B17",
      },
    });
    const canGoNext: number = Number(data.data);
    if (canGoNext != 0) {
      window.location.href = "../result/player-4";
    } else {
      alert("集計をお待ち下さい");
    }
  };

  return (
    <>
      <div className={styles.container}>
        <p className={styles.btmg5}>　</p>
        <div className={styles.main}>
          <div className={styles.pagetitlebox}>
            <h1>
              Player 4<br />
              工事1~5入札
            </h1>
          </div>

          <form>
            <div className={styles.contents}>
              <div className={styles.biddings}>
                事業1：DMTC本部耐震工事
                <br />
                工事費：1億円
                <br />
                入札経費：0.1億円
                <br />
                あなたの入札額：{answer1}億円
                <br />
                <textarea
                  disabled={isAnswer1 == 0}
                  onChange={handleTextareaChange1}
                  value={answer1}
                  className={styles.textarea4bid}
                />
                <br />
                <input
                  type="checkbox"
                  id="subscribeNews"
                  name="subscribe"
                  value="newsletter"
                  onChange={handleCheckBoxChange1}
                />
                工事1に入札しない
              </div>
              <div className={styles.biddings}>
                事業2：神武橋補修工事
                <br />
                工事費：100億円
                <br />
                入札経費：10億円
                <br />
                あなたの入札額：{answer2}億円
                <br />
                <textarea
                  disabled={isAnswer2 == 0}
                  onChange={handleTextareaChange2}
                  value={answer2}
                  className={styles.textarea4bid}
                />
                <br />
                <input
                  type="checkbox"
                  id="subscribeNews"
                  name="subscribe"
                  value="newsletter"
                  onChange={handleCheckBoxChange2}
                />
                工事2に入札しない
              </div>
              <div className={styles.biddings}>
                事業3：三四郎池埋設工事
                <br />
                工事費：346億円
                <br />
                入札経費：34.6億円
                <br />
                あなたの入札額：{answer3}億円
                <br />
                <textarea
                  disabled={isAnswer3 == 0}
                  onChange={handleTextareaChange3}
                  value={answer3}
                  className={styles.textarea4bid}
                />
                <br />
                <input
                  type="checkbox"
                  id="subscribeNews"
                  name="subscribe"
                  value="newsletter"
                  onChange={handleCheckBoxChange3}
                />
                工事3に入札しない
              </div>
              <div className={styles.biddings}>
                事業4：モール通り円形歩道整備
                <br />
                工事費：30億円
                <br />
                入札経費：3億円
                <br />
                あなたの入札額：{answer4}億円
                <br />
                <textarea
                  disabled={isAnswer4 == 0}
                  onChange={handleTextareaChange4}
                  value={answer4}
                  className={styles.textarea4bid}
                />
                <br />
                <input
                  type="checkbox"
                  id="subscribeNews"
                  name="subscribe"
                  value="newsletter"
                  onChange={handleCheckBoxChange4}
                />
                工事4に入札しない
              </div>
              <div className={styles.biddings}>
                事業5：フルード川堤防工事
                <br />
                工事費：20億円
                <br />
                入札経費：2億円
                <br />
                あなたの入札額：{answer5}億円
                <br />
                <textarea
                  disabled={isAnswer5 == 0}
                  onChange={handleTextareaChange5}
                  value={answer5}
                  className={styles.textarea4bid}
                />
                <br />
                <input
                  type="checkbox"
                  id="subscribeNews"
                  name="subscribe"
                  value="newsletter"
                  onChange={handleCheckBoxChange5}
                />
                工事5に入札しない
              </div>
            </div>
          </form>
          <div>
            {(isAnswer1 == 0 || answer1 != "") &&
            (isAnswer2 == 0 || answer2 != "") &&
            (isAnswer3 == 0 || answer3 != "") &&
            (isAnswer4 == 0 || answer4 != "") &&
            (isAnswer5 == 0 || answer5 != "") ? (
              <button onClick={ConfirmButtonHandler} className={styles.btn}>
                入札を確定する
              </button>
            ) : (
              <p>すべての工事についてアクションを決定してください</p>
            )}
          </div>
          <br />
          <div>
            {isSubmitted == 1 ? (
              <button onClick={NextButtonHandler} className={styles.btn}>
                次へ進む
              </button>
            ) : (
              ""
            )}
          </div>
        </div>
        <p className={styles.tpmg5}>　</p>
      </div>
    </>
  );
}
