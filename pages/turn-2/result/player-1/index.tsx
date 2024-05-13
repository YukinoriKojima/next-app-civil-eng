import styles from "../../../../styles/Home.module.css"
import { MouseEventHandler, useEffect } from "react";
import axios from 'axios';
import { useState, useRef } from "react";
import _ from 'lodash';
import { Audio, BallTriangle, ThreeDots } from 'react-loader-spinner'

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
    const [benefitDisplay, setBenefitDisplay] = useState(0);
    const [sheetName, setSheetName] = useState("")
    const isLoading = useRef(0);
    const [currentScore, setCurrentScore] = useState([0, 0, 0, 0])
    var empty = ["", "", "", "", ""];
    const [Winner, setWinner] = useState(["", "", "", "", ""]);
    const thisTurn = 2;

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
                startCol: 8
            }
        });
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 5; j++) {
                var tmpResults = [...results];
                tmpResults[i][j] = bulk.data[`row${i}`][`col${j}`];
                if (Number(tmpResults[i][j]) < 0) {
                    tmpResults[i][j] = '入札なし'
                }
                setResults(tmpResults);
            }
        }
        isLoading.current = 0;

    }

    const firmButton: MouseEventHandler<HTMLButtonElement> = async () => {

        const bulk = await axios.get(bulkGetApiUrl, {
            params: {
                crossDomein: true,
                sheetName: sheetName,
                numRow: 1,
                numCol: 5,
                startRow: 6,
                startCol: 5*thisTurn-2
            }
        });
        var tmpWinner = [...Winner];
        for (let j = 0; j < 5; j++) {
            tmpWinner[j] = bulk.data[`row0`][`col${j}`];
            setWinner(tmpWinner);
        }
        setFirm(1);
        isLoading.current = 0;
    }

    const tmpTotalButton: MouseEventHandler<HTMLButtonElement> = async () => {
        isLoading.current = 1;


        const bulk = await axios.get(bulkGetApiUrl, {
            params: {
                crossDomein: true,
                sheetName: sheetName,
                numRow: 4,
                numCol: 1,
                startRow: 12,
                startCol: thisTurn+2
            }
        });
        var tmpCurrentScore = [...currentScore];
        for (let j = 0; j < 4; j++) {
            tmpCurrentScore[j] = bulk.data[`row${j}`][`col0`];
            setCurrentScore(tmpCurrentScore);
        }
        setBenefitDisplay(1);
        isLoading.current = 0;
    }

    const GoNextBid: MouseEventHandler<HTMLButtonElement> = async () => {
        window.location.href = `../../../turn-${thisTurn+1}/submit/player-1`
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
                        <h1>入札1~5<br />結果発表</h1>
                    </div>

                    <table className={styles.table}>
                        <thead>
                            <tr className={styles.tablehead}><th></th>
                                <th>工事6</th>
                                <th>工事7</th>
                                <th>工事8</th>
                                <th>工事9</th>
                                <th>工事10</th>
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

                    <button onClick={bidResultButton} className={styles.btn}>結果を表示する</button><br /><br />
                    {(bid == 1) ? <button onClick={firmButton} className={styles.btn}>落札企業を表示する</button> : ""}<br /><br />
                    {(firm == 1) ? <button onClick={tmpTotalButton} className={styles.btn}>暫定の利益額を表示する</button> : ""}<br />
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
                                    {currentScore.map((m, index) => (<td className={styles.cell} key={index}>{m}</td>))}
                                </tr>
                            </tbody><br />
                        </table> : ""}
                    {(benefitDisplay == 1) ? <button className={styles.btn} onClick={GoNextBid}>次へ進む</button> : ""}<br />
                </main>
                <p className={styles.tpmg5}>　</p>
            </div>
        </>
    );
};
