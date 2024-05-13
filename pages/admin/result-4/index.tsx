import styles from "../../../styles/Home.module.css";
import { MouseEventHandler, useEffect } from "react";
import axios from "axios";
import { useState, useRef } from "react";
import _ from "lodash";
import { Audio, BallTriangle, ThreeDots } from "react-loader-spinner";
import { cost4, bidCost4 } from "@/constant/constant";

const createApiUrl = String(process.env.NEXT_PUBLIC_CREATE_API_URL);
const setApiUrl = String(process.env.NEXT_PUBLIC_SET_API_URL);
const bulkGetApiUrl = String(process.env.NEXT_PUBLIC_BULK_GET_API_URL);
const bulkSetApiUrl = String(process.env.NEXT_PUBLIC_BULK_SET_API_URL);
const getApiUrl = String(process.env.NEXT_PUBLIC_GET_API_URL);

function getRandomElement<T>(list: T[]): T {
  return list[Math.floor(Math.random() * list.length)];
}

export default function Start() {
  const [bid, setBid] = useState(0);
  const [firm, setFirm] = useState(0);
  const [results, setResults] = useState([
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
  ]);
  const [benefit, setBenefit] = useState([
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
  ]);
  const [benefitDisplay, setBenefitDisplay] = useState(0);
  const [sheetName, setSheetName] = useState("");
  const isLoading = useRef(0);
  const [currentScore, setCurrentScore] = useState([0, 0, 0, 0]);
  var cost = cost4;
  var bidCost = bidCost4;

  var empty = ["", "", "", "", ""];
  const [Winner, setWinner] = useState(["", "", "", "", ""]);

  interface Obj {
    [prop: string]: any; // これを記述することで、どんなプロパティでも持てるようになる
  }

  const bidResultButton: MouseEventHandler<HTMLButtonElement> = async () => {
    setBid(1);
    isLoading.current = 1;
    var data = await axios.get(getApiUrl, {
      params: {
        crossDomein: true,
        sheetName: "currentGame",
        cellId: "A1",
      },
    });
    var tmpSheetName = data.data;
    setSheetName(tmpSheetName);
    const bulk = await axios.get(bulkGetApiUrl, {
      params: {
        crossDomein: true,
        sheetName: tmpSheetName,
        numRow: 4,
        numCol: 5,
        startRow: 2,
        startCol: 18,
      },
    });
    var tmpResults = [...results];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 5; j++) {
        var tmptmpResults = [...tmpResults];
        tmptmpResults[i][j] = bulk.data[`row${i}`][`col${j}`];
        if (Number(tmpResults[i][j]) < 0) {
          tmptmpResults[i][j] = "入札なし";
        }
        tmpResults = tmptmpResults;
      }
    }

    var lowerCost = cost.map((c) => c * 1.21);
    var upperCost = cost.map((c) => c * 1.87);
    var tmpList: string[] = ["", "", "", "", ""];
    for (let num = 0; num < 5; num++) {
      var tmpFirst = cost[num] * 3000;
      var tmpSecond = cost[num] * 4000;
      var tmp1stNum: string[] = [];
      var tmp2ndNum: string[] = [];
      for (let player = 0; player < 4; player++) {
        if (
          Number(results[player][num]) <= upperCost[num] &&
          Number(results[player][num]) >= lowerCost[num]
        ) {
          if (tmpFirst > Number(results[player][num])) {
            tmp2ndNum = tmp1stNum;
            tmp1stNum = [`player ${player + 1}`];
            tmpSecond = tmpFirst;
            tmpFirst = Number(results[player][num]);
          } else if ((tmpFirst = Number(results[player][num]))) {
            tmp1stNum.push(`player ${player + 1}`);
          } else if (
            tmpFirst < Number(results[player][num]) &&
            Number(results[player][num]) < tmpSecond
          ) {
            tmpSecond = Number(results[player][num]);
            tmp2ndNum = [`player ${player + 1}`];
          } else if (Number(results[player][num]) == tmpSecond) {
            tmp2ndNum.push(`player ${player + 1}`);
          }
        }
      }
      if (tmp2ndNum.length == 0) {
        if (tmp1stNum.length == 0) {
          tmpList[num] = "落札不調";
        } else {
          tmpList[num] = getRandomElement(tmp1stNum);
        }
      } else {
        tmpList[num] = getRandomElement(tmp2ndNum);
      }
    }
    setWinner(tmpList);
    setFirm(1);
    isLoading.current = 0;

    var tmpJSON: Obj = {};
    tmpJSON[`row0`] = {};
    for (let i = 0; i < 5; i++) {
      tmpJSON[`row0`][`col${i}`] = tmpList[i];
    }

    const settingTmpJSON = await axios.get(bulkSetApiUrl, {
      params: {
        crossDomein: true,
        sheetName: tmpSheetName,
        numRow: 1,
        numCol: 5,
        startRow: 6,
        startCol: 18,
        values: JSON.stringify(tmpJSON),
      },
    });
  };

  const tmpTotalButton: MouseEventHandler<HTMLButtonElement> = async () => {
    isLoading.current = 1;
    var benefitValues: Obj = {};
    var tmpBenefit = [
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
    ];
    for (let player = 0; player < 4; player++) {
      benefitValues[`row${player}`] = {};
      for (let num = 0; num < 5; num++) {
        if (Winner[num] == `player ${player + 1}`) {
          tmpBenefit[player][num] =
            Number(results[player][num]) - bidCost[num] - cost[num];
        } else {
          if (Number(results[player][num]) >= 0) {
            tmpBenefit[player][num] = -bidCost[num];
          } else {
            tmpBenefit[player][num] = 0;
          }
        }
        benefitValues[`row${player}`][`col${num}`] = tmpBenefit[player][num];
      }
    }

    const tmpSumData = await axios.get(bulkGetApiUrl, {
      params: {
        crossDomein: true,
        sheetName: sheetName,
        numRow: 4,
        numCol: 1,
        startRow: 12,
        startCol: 5,
      },
    });
    const tsdJSON = tmpSumData.data;
    var tmpSum: Obj = {};
    var tmpSumList: number[] = [0, 0, 0, 0];
    for (let i = 0; i < 4; i++) {
      tmpSum[`row${i}`] = {};
      tmpSum[`row${i}`]["col0"] =
        _.sum(tmpBenefit[i]) + tsdJSON[`row${i}`]["col0"];
      tmpSumList[i] = _.sum(tmpBenefit[i]) + tsdJSON[`row${i}`]["col0"];
    }
    setCurrentScore(tmpSumList);

    const settingTmpSum = await axios.get(bulkSetApiUrl, {
      params: {
        crossDomein: true,
        sheetName: sheetName,
        numRow: 4,
        numCol: 1,
        startRow: 12,
        startCol: 6,
        values: JSON.stringify(tmpSum),
      },
    });

    const setGoNext = await axios.get(setApiUrl, {
      params: {
        sheetName: sheetName,
        cellId: "E17",
        value: "1",
      },
    });
    setBenefit(tmpBenefit);
    setBenefitDisplay(1);
    isLoading.current = 0;
    const bulk = await axios.get(bulkSetApiUrl, {
      params: {
        crossDomein: true,
        sheetName: sheetName,
        numRow: 4,
        numCol: 5,
        startRow: 7,
        startCol: 18,
        values: JSON.stringify(benefitValues),
      },
    });
  };

  const GoNextBid: MouseEventHandler<HTMLButtonElement> = async () => {
    window.location.href = "result-3";
  };

  return (
    <>
      <div className={styles.container}>
        <p className={styles.btmg5}>　</p>
        {isLoading.current == 1 ? (
          <div>
            <div className={styles.loaderbg}>
              <div className={styles.loadingfig}>
                <div className={styles.child}>
                  <ThreeDots
                    height="200"
                    width="200"
                    // radius="9"
                    color="#627932"
                    ariaLabel="three-dots-loading"
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
        <main className={styles.main}>
          <div className={styles.pagetitlebox}>
            <h1>
              入札1~5
              <br />
              結果発表
              <br />
              管理者用画面
            </h1>
          </div>

          <table className={styles.table}>
            <thead>
              <tr className={styles.tablehead}>
                <th></th>
                <th>工事1</th>
                <th>工事2</th>
                <th>工事3</th>
                <th>工事4</th>
                <th>工事5</th>
              </tr>
            </thead>
            <tbody>
              <tr className={styles.cell}>
                <td className={styles.cell}>Player 1</td>
                {bid == 1
                  ? results[0].map((m, index) => (
                      <td className={styles.cell} key={index}>
                        {m}
                      </td>
                    ))
                  : empty.map((m, index) => (
                      <td width="200px" className={styles.cell} key={index}>
                        {m}
                      </td>
                    ))}
              </tr>
              <tr className={styles.cell}>
                <td className={styles.cell}>Player 2</td>
                {bid == 1
                  ? results[1].map((m, index) => (
                      <td className={styles.cell} key={index}>
                        {m}
                      </td>
                    ))
                  : empty.map((m, index) => (
                      <td className={styles.cell} key={index}>
                        {m}
                      </td>
                    ))}
              </tr>
              <tr className={styles.cell}>
                <td className={styles.cell}>Player 3</td>
                {bid == 1
                  ? results[2].map((m, index) => (
                      <td className={styles.cell} key={index}>
                        {m}
                      </td>
                    ))
                  : empty.map((m, index) => (
                      <td className={styles.cell} key={index}>
                        {m}
                      </td>
                    ))}
              </tr>
              <tr className={styles.cell}>
                <td className={styles.cell}>Player 4</td>
                {bid == 1
                  ? results[3].map((m, index) => (
                      <td className={styles.cell} key={index}>
                        {m}
                      </td>
                    ))
                  : empty.map((m, index) => (
                      <td className={styles.cell} key={index}>
                        {m}
                      </td>
                    ))}
              </tr>
              <tr className={styles.cell}>
                <td className={styles.cell}>落札企業</td>
                {Winner.map((w, index) => (
                  <td className={styles.cell} key={index}>
                    {w}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
          <br />

          <button onClick={bidResultButton} className={styles.btn}>
            結果を表示する
          </button>
          <br />
          <br />
          {firm == 1 ? (
            <button onClick={tmpTotalButton} className={styles.btn}>
              結果を確定し，暫定の利益額を表示する
            </button>
          ) : (
            ""
          )}
          <br />
          {benefitDisplay == 1 ? (
            <table className={styles.table}>
              <tbody>
                <tr className={styles.tablehead}>
                  <td width="200px">Player 1</td>
                  <td width="200px">Player 2</td>
                  <td width="200px">Player 3</td>
                  <td width="200px">Player 4</td>
                </tr>
                <tr>
                  {currentScore.map((m, index) => (
                    <td className={styles.cell} key={index}>
                      {m}
                    </td>
                  ))}
                </tr>
              </tbody>
              <br />
            </table>
          ) : (
            ""
          )}
          {benefitDisplay == 1 ? (
            <button className={styles.btn} onClick={GoNextBid}>
              次へ進む
            </button>
          ) : (
            ""
          )}
          <br />
        </main>
        <p className={styles.tpmg5}>　</p>
      </div>
    </>
  );
}
