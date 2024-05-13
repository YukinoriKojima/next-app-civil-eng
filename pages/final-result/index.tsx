import styles from "../../styles/Home.module.css";
import { MouseEventHandler, useEffect, useRef } from "react";
import axios from "axios";
import { useState } from "react";
import _ from "lodash";
import { Audio, BallTriangle, ThreeDots } from "react-loader-spinner";

const createApiUrl = String(process.env.NEXT_PUBLIC_CREATE_API_URL);
const setApiUrl = String(process.env.NEXT_PUBLIC_SET_API_URL);
const bulkGetApiUrl = String(process.env.NEXT_PUBLIC_BULK_GET_API_URL);
const bulkSetApiUrl = String(process.env.NEXT_PUBLIC_BULK_SET_API_URL);
const getApiUrl = String(process.env.NEXT_PUBLIC_GET_API_URL);

function getRandomElement<T>(list: T[]): T {
  return list[Math.floor(Math.random() * list.length)];
}

export default function Start() {
  const isLoading = useRef(0);
  const [isDisplay, setIsDisplay] = useState(0);
  const [sheetName, setSheetName] = useState("");
  type PointName = {
    name: string;
    point: number;
  };
  const [PointNames, setPointNames] = useState([
    { name: "", point: 0 },
    { name: "", point: 0 },
    { name: "", point: 0 },
    { name: "", point: 0 },
  ]);

  const displayRanking: MouseEventHandler<HTMLButtonElement> = async () => {
    isLoading.current = 1;

    var tmpPointName: PointName[] = [];
    var data = await axios.get(getApiUrl, {
      params: {
        crossDomein: true,
        sheetName: "currentGame",
        cellId: "A1",
      },
    });
    var tmpSheetName = data.data;
    setSheetName(tmpSheetName);

    const bulkData1 = await axios.get(bulkGetApiUrl, {
      params: {
        crossDomein: true,
        sheetName: tmpSheetName,
        numRow: 4,
        numCol: 1,
        startRow: 2,
        startCol: 1,
      },
    });
    const bulkData2 = await axios.get(bulkGetApiUrl, {
      params: {
        crossDomein: true,
        sheetName: tmpSheetName,
        numRow: 4,
        numCol: 1,
        startRow: 12,
        startCol: 6,
      },
    });
    const bulkName = bulkData1.data;
    const bulkPoint = bulkData2.data;

    for (let i = 0; i < 4; i++) {
      var eachPN: PointName = {
        name: bulkName[`row${i}`]["col0"],
        point: Number(bulkPoint[`row${i}`]["col0"]),
      };
      tmpPointName.push(eachPN);
    }

    tmpPointName = tmpPointName.sort((a, b) => -a.point + b.point);
    setPointNames(tmpPointName);
    setIsDisplay(1);
    isLoading.current = 0;
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
              全入札
              <br />
              最終結果発表
            </h1>
          </div>
          <div className={styles.tablebox}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>順位</th>
                  <th>社名</th>
                  <th>得点</th>
                </tr>
              </thead>

              {isDisplay == 1 ? (
                <tbody>
                  <tr className={styles.first}>
                    <td width="300px" height="100">
                      優勝
                    </td>
                    <td width="300px" height="100">
                      {PointNames[0].name}
                    </td>
                    <td width="300px" height="100">
                      {PointNames[0].point}
                    </td>
                  </tr>
                  <tr className={styles.second}>
                    <td width="300px" height="100">
                      2nd
                    </td>
                    <td width="300px" height="100">
                      {PointNames[1].name}
                    </td>
                    <td width="300px" height="100">
                      {PointNames[1].point}
                    </td>
                  </tr>
                  <tr className={styles.third}>
                    <td width="300px" height="100">
                      3rd
                    </td>
                    <td width="300px" height="100">
                      {PointNames[2].name}
                    </td>
                    <td width="300px" height="100">
                      {PointNames[2].point}
                    </td>
                  </tr>
                  <tr>
                    <td width="300px" height="100">
                      4th
                    </td>
                    <td width="300px" height="100">
                      {PointNames[3].name}
                    </td>
                    <td width="300px" height="100">
                      {PointNames[3].point}
                    </td>
                  </tr>
                </tbody>
              ) : (
                <tbody>
                  <tr className={styles.first}>
                    {" "}
                    <td width="300px" height="100">
                      　　　
                    </td>
                    <td width="300px" height="100">
                      　　　
                    </td>
                    <td width="300px" height="100">
                      　　　
                    </td>
                  </tr>
                  <tr className={styles.second}>
                    {" "}
                    <td width="300px" height="100">
                      　　　
                    </td>
                    <td width="300px" height="100">
                      　　　
                    </td>
                    <td width="300px" height="100">
                      　　　
                    </td>
                  </tr>
                  <tr className={styles.third}>
                    {" "}
                    <td width="300px" height="100">
                      　　　
                    </td>
                    <td width="300px" height="100">
                      　　　
                    </td>
                    <td width="300px" height="100">
                      　　　
                    </td>
                  </tr>
                  <tr>
                    {" "}
                    <td width="300px" height="100">
                      　　　
                    </td>
                    <td width="300px" height="100">
                      　　　
                    </td>
                    <td width="300px" height="100">
                      　　　
                    </td>
                  </tr>
                </tbody>
              )}
            </table>
          </div>
          <br />
          <button className={styles.btn} onClick={displayRanking}>
            結果を表示する
          </button>
        </main>
        <p className={styles.tpmg5}>　</p>
      </div>
    </>
  );
}
