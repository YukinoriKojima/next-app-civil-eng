import styles from "../../../styles/Home.module.css"
import { MouseEventHandler, useEffect } from "react";
import axios from 'axios';
import { useState, useRef } from "react";
import _ from 'lodash';
import { Audio, BallTriangle, ThreeDots } from 'react-loader-spinner'
import { bidCost3, cost3 } from "@/constant/constant";

const createApiUrl = String(process.env.NEXT_PUBLIC_CREATE_API_URL);
const setApiUrl = String(process.env.NEXT_PUBLIC_SET_API_URL);
const bulkGetApiUrl = String(process.env.NEXT_PUBLIC_BULK_GET_API_URL);
const bulkSetApiUrl = String(process.env.NEXT_PUBLIC_BULK_SET_API_URL);
const getApiUrl = String(process.env.NEXT_PUBLIC_GET_API_URL);
function getRandomElement<T>(list: T[]): T {
    return list[Math.floor(Math.random() * list.length)];
}

type dictionary = { 
    [key:string]:number
}
type dict2D = {
    [key:string]:dictionary
}

function getColumnMaxValues(twoDimensionalList: string[][]): number[] {
    var columnMaxValues: number[] = [0,0,0,0,0];

    for (let column = 0; column < twoDimensionalList[0].length; column++) {
        let maxInColumn = -100;
        for (let row = 1; row < twoDimensionalList.length; row++) {
            const currentValue = Number(twoDimensionalList[row][column]);
            if ((!isNaN(currentValue)) && currentValue > maxInColumn) {
                maxInColumn = currentValue;
            }
        }
        columnMaxValues[column] = maxInColumn;
    }
    return columnMaxValues;
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
    const [benefit, setBenefit] = useState([[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]]);
    const [benefitDisplay, setBenefitDisplay] = useState(0);
    const [sheetName, setSheetName] = useState("")
    const isLoading = useRef(0);
    const [currentScore, setCurrentScore] = useState([0,0,0,0])
    var cost = cost3;
    var bidCost = bidCost3;

    var bidArea = ["north", "mid", "south", "north", "south"];
    var areaPoint:dict2D = {
        "north": {
            "north":3,
            "mid":2,
            "south":1
        },
        "mid": {
            "north":2,
            "mid":2,
            "south":2
        },
        "south": {
            "north":1,
            "mid":2,
            "south":3
        },
    }

    var empty = ["", "", "", "", ""];
    const [Winner, setWinner] = useState(["", "", "", "", ""]);

    interface Obj {
        [prop: string]: any // これを記述することで、どんなプロパティでも持てるようになる
    }


    const bidResultButton: MouseEventHandler<HTMLButtonElement> = async () => {
        setBid(1);
        isLoading.current = 1;
        var data = await axios.get(getApiUrl, {
            params: {
                crossDomein: true,
                sheetName: 'currentGame',
                cellId: 'A1'
            }
        })
        var tmpSheetName = data.data
        setSheetName(tmpSheetName);
        const bulk = await axios.get(bulkGetApiUrl, {
            params: {
                crossDomein: true,
                sheetName: tmpSheetName,
                numRow: 4,
                numCol: 5,
                startRow: 2,
                startCol: 13
            }
        });
        var tmpResults = [...results];
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 5; j++) {
                var tmptmpResults = [...tmpResults];
                tmptmpResults[i][j] = bulk.data[`row${i}`][`col${j}`];
                if (Number(tmpResults[i][j]) < 0) {
                    tmptmpResults[i][j] = '入札なし'
                }
                tmpResults =tmptmpResults;
            }
        }


        const bulkArea = await axios.get(bulkGetApiUrl, {
            params: {
                crossDomein: true,
                sheetName: tmpSheetName,
                numRow: 4,
                numCol: 1,
                startRow: 2,
                startCol: 2
            }
        });
        const tmpArea = bulkArea.data
        const tmpAreaList:string[] = [tmpArea['row0']['col0'],tmpArea['row1']['col0'],tmpArea['row2']['col0'],tmpArea['row3']['col0']];

        var lowerCost = cost.map(c => c * 1.21);
        var upperCost = cost.map(c => c * 1.87);
        var tmpList: string[] = ["", "", "", "", ""];

        var maxBid = getColumnMaxValues(tmpResults);


        for (let num = 0; num < 5; num++) {
            var tmp = -1;
            var tmpWinner: string[] = [];
            for (let player = 0; player < 4; player++) {
                if (Number(tmpResults[player][num]) <= upperCost[num] && Number(tmpResults[player][num]) >= lowerCost[num]) {
                    if (tmp < maxBid[num]*10/Number(tmpResults[player][num]) + areaPoint[tmpAreaList[player]][bidArea[num]]) {
                        tmpWinner = [`player ${player + 1}`];
                        tmp = maxBid[num]*10/Number(tmpResults[player][num])+areaPoint[tmpAreaList[player]][bidArea[num]];
                    }
                    else if (tmp == maxBid[num]*10/Number(tmpResults[player][num])+areaPoint[tmpAreaList[player]][bidArea[num]]) {
                        tmpWinner.push(`player ${player + 1}`);
                    }
                }
            }
            if (tmpWinner.length == 0) {
                tmpList[num] = '落札不調'

            }
            else {
                tmpList[num] = getRandomElement(tmpWinner);
            }
        }
        setWinner(tmpList);
        setFirm(1);
        isLoading.current = 0;
        var tmpJSON: Obj = {};
        tmpJSON[`row0`] = {};
        for(let i=0; i<5; i++){
            tmpJSON[`row0`][`col${i}`] = tmpList[i]
        }
        
        const settingTmpJSON = await axios.get(bulkSetApiUrl, {
            params: {
                crossDomein: true,
                sheetName: tmpSheetName,
                numRow: 1,
                numCol: 5,
                startRow:6,
                startCol: 13,
                values: JSON.stringify(tmpJSON),
            }
        })
    }

    const tmpTotalButton: MouseEventHandler<HTMLButtonElement> = async () => {
        isLoading.current=1;
        var benefitValues: Obj = {};
        var tmpBenefit = [[0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0]];
        for (let player = 0; player < 4; player++) {
            benefitValues[`row${player}`] = {};
            for (let num = 0; num < 5; num++) {
                if (Winner[num] == `player ${player + 1}`) {
                    tmpBenefit[player][num] = Number(results[player][num]) - bidCost[num] - cost[num];
                }
                else {
                    if (Number(results[player][num]) >= 0) {
                        tmpBenefit[player][num] = -bidCost[num];
                    }
                    else {
                        tmpBenefit[player][num] = 0;
                    }
                }
                benefitValues[`row${player}`][`col${num}`] = tmpBenefit[player][num]
            }
        }

        const tmpSumData = await axios.get(bulkGetApiUrl, {
            params: {
                crossDomein: true,
                sheetName: sheetName,
                numRow: 4,
                numCol: 1,
                startRow: 12,
                startCol: 4,
            }
        })
        const tsdJSON = tmpSumData.data;
        var tmpSum: Obj = {};
        var tmpSumList:number[] = [0,0,0,0];
        for(let i=0; i<4; i++){
            tmpSum[`row${i}`] = {};
            tmpSum[`row${i}`]["col0"] = _.sum(tmpBenefit[i])+tsdJSON[`row${i}`]["col0"];
            tmpSumList[i]  = _.sum(tmpBenefit[i])+tsdJSON[`row${i}`]["col0"];
        }
        setCurrentScore(tmpSumList);
        
        const settingTmpSum = await axios.get(bulkSetApiUrl, {
            params: {
                crossDomein: true,
                sheetName: sheetName,
                numRow: 4,
                numCol: 1,
                startRow:12,
                startCol: 5,
                values: JSON.stringify(tmpSum),
            }
        })

        const setGoNext = await axios.get(setApiUrl, {
            params: {
                sheetName: sheetName,
                cellId: 'D17',
                value: "1" }}
        );
        setBenefit(tmpBenefit);
        setBenefitDisplay(1);
        isLoading.current=0;
        const bulk = await axios.get(bulkSetApiUrl, {
            params: {
                crossDomein: true,
                sheetName: sheetName,
                numRow: 4,
                numCol: 5,
                startRow: 7,
                startCol: 13,
                values: JSON.stringify(benefitValues),
            }
        })
        

    }

    const GoNextBid:MouseEventHandler<HTMLButtonElement> = async()=>{
        window.location.href = "result-4"
    }

    return (
        <>
            <div className={styles.container}>
                <p className={styles.btmg5}>　</p>
                {isLoading.current == 1 ? <div>
                    <div className={styles.loaderbg}>
                        <div className={styles.loadingfig}><div className={styles.child}>
                            <ThreeDots
                                height="200"
                                width="200"
                                // radius="9"
                                color="#627932"
                                ariaLabel="three-dots-loading"
                            /></div></div></div>
                </div> : ""}
                <main className={styles.main}>
                    <div className={styles.pagetitlebox}>
                        <h1>入札11~15<br />結果発表3<br/>管理者用画面</h1>
                    </div>

                        <table className={styles.table}>
                            <thead>
                                <tr className={styles.tablehead}><th></th>
                                    <th>工事11</th>
                                    <th>工事12</th>
                                    <th>工事13</th>
                                    <th>工事14</th>
                                    <th>工事15</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className={styles.cell}>
                                    <td className={styles.cell}>Player 1</td>
                                    {bid == 1 ? results[0].map((m, index) => (<td className={styles.cell} key={index}>{m}</td>)) : empty.map((m, index) => (<td width="200px" className={styles.cell} key={index}>{m}</td>))
                                    }
                                </tr>
                                <tr className={styles.cell}>
                                    <td className={styles.cell}>Player 2</td>
                                    {bid == 1 ? results[1].map((m, index) => (<td className={styles.cell} key={index}>{m}</td>)) : empty.map((m, index) => (<td className={styles.cell} key={index}>{m}</td>))
                                    }
                                </tr>
                                <tr className={styles.cell}>
                                    <td className={styles.cell}>Player 3</td>
                                    {bid == 1 ? results[2].map((m, index) => (<td className={styles.cell} key={index}>{m}</td>)) : empty.map((m, index) => (<td className={styles.cell} key={index}>{m}</td>))
                                    }
                                </tr>
                                <tr className={styles.cell}>
                                    <td className={styles.cell}>Player 4</td>
                                    {bid == 1 ? results[3].map((m, index) => (<td className={styles.cell} key={index}>{m}</td>)) : empty.map((m, index) => (<td className={styles.cell} key={index}>{m}</td>))
                                    }
                                </tr>
                                <tr className={styles.cell}>
                                    <td className={styles.cell}>落札企業</td>
                                    {Winner.map((w, index) => (<td className={styles.cell} key={index}>{w}</td>))}
                                </tr>
                            </tbody>
                        </table><br />

                    <button onClick={bidResultButton} className={styles.btn}>結果を生成する</button><br /><br />
                    {(firm == 1) ? <button onClick={tmpTotalButton} className={styles.btn}>結果を確定し，暫定の利益額を表示する</button> : ""}<br/>
                    {(benefitDisplay == 1) ?
                        <table className={styles.table}>
                            <tbody>
                                <tr className={styles.tablehead}>
                                    <td width="200px">Player 1</td>
                                    <td width="200px">Player 2</td>
                                    <td width="200px">Player 3</td>
                                    <td width="200px">Player 4</td>
                                </tr>
                                <tr>
                                    {currentScore.map((m,index)=>(<td className={styles.cell} key={index}>{m}</td>))}
                                </tr>
                            </tbody><br/>
                        </table> : ""}
                        {(benefitDisplay==1)?<button className={styles.btn} onClick={GoNextBid}>次へ進む</button>:""}<br/>
                </main>
                <p className={styles.tpmg5}>　</p>
            </div>
        </>
    );
};
