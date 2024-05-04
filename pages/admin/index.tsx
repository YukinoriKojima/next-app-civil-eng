import React from "react";
import axios from 'axios';
import { useState } from "react";
import { ChangeEventHandler } from "react";
import { MouseEventHandler, useRef} from "react";
import { FormEventHandler } from "react";
import styles from "../../styles/Home.module.css"
import Select from 'react-select'
import Link from "next/link";
import { json } from "react-router-dom";
import { Audio, BallTriangle, ThreeDots } from 'react-loader-spinner'

const initialName: string = "Unknown";

const createApiUrl = String(process.env.NEXT_PUBLIC_CREATE_API_URL);
const setApiUrl = String(process.env.NEXT_PUBLIC_SET_API_URL);
const bulkGetApiUrl = String(process.env.NEXT_PUBLIC_BULK_GET_API_URL);
const bulkSetApiUrl = String(process.env.NEXT_PUBLIC_BULK_SET_API_URL);
const getApiUrl = String(process.env.NEXT_PUBLIC_GET_API_URL);

export default function SettingAdmin() {

    const [sheetName, setSheetName] = useState("");
    const [pass1, setPass1] = useState(0);
    const [pass2, setPass2] = useState(0);
    const [pass3, setPass3] = useState(0);
    const [pass4, setPass4] = useState(0);

    const isLoading = useRef(0);

    const NextButtonHandler1: MouseEventHandler<HTMLButtonElement> = async () => {

        isLoading.current = 1;
        const tmpSheetNameData = await axios.get(getApiUrl, {
            params: {
                crossDomein: true,
                sheetName: 'currentGame',
                cellId: 'A1',
            }
        });

        const tmpSheetName: string = tmpSheetNameData.data;
        setSheetName(tmpSheetName);
        if (true) {
            setPass1(1);
            const ntg = await axios.get(setApiUrl, {
                params: {
                    crossDomein: true,
                    sheetName: tmpSheetName,
                    cellId: 'C17',
                    value: 1
                }
            });
        }
        isLoading.current = 0;
    }
    

    const NextButtonHandler2: MouseEventHandler<HTMLButtonElement> = async () => {
        isLoading.current = 1;
        if (pass1 == 1) {
            setPass2(1);
            const ntg = await axios.get(setApiUrl, {
                params: {
                    crossDomein: true,
                    sheetName: sheetName,
                    cellId: 'C18',
                    value: 1
                }
            });
        }
        else {
            alert("前の段階のボタンが押されていません")
        }
        isLoading.current = 0;
    }

    const NextButtonHandler3: MouseEventHandler<HTMLButtonElement> = async () => {
        isLoading.current = 1;
        if (pass2 == 1) {
            setPass3(1);
            const ntg = await axios.get(setApiUrl, {
                params: {
                    crossDomein: true,
                    sheetName: sheetName,
                    cellId: 'C19',
                    value: 1,
                }
            });
        }
        else {
            alert("前の段階のボタンが押されていません")
        }
        isLoading.current = 0;
    }
    const NextButtonHandler4: MouseEventHandler<HTMLButtonElement> = async () => {
        isLoading.current = 1;
        if (pass3 == 1) {
            setPass4(1);
            const ntg = await axios.get(setApiUrl, {
                params: {
                    crossDomein: true,
                    sheetName: sheetName,
                    cellId: 'C20',
                    value: 1
                }
            });
        }
        else {
            alert("前の段階のボタンが押されていません")
        }
        isLoading.current = 0;
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
                <div className={styles.main}>
                    <div className={styles.pagetitlebox}>
                        <h1>全入札<br />最終結果発表</h1>
                    </div>
                    <div className={styles.contents}>

                        <button className={styles.btn} onClick={NextButtonHandler1}>ゲーム1からゲーム2に<br />進めるようにする</button>
                        {pass1==1?<p>1から2への遷移を許可しました</p>:" "}
                        <p className={styles.btmg5}>　</p>
                        <button className={styles.btn} onClick={NextButtonHandler2}>ゲーム2からゲーム3に<br />進めるようにする</button>
                        <p className={styles.btmg5}>　</p>
                        <button className={styles.btn} onClick={NextButtonHandler3}>ゲーム3からゲーム4に<br />進めるようにする</button>
                        <p className={styles.btmg5}>　</p>
                        <button className={styles.btn} onClick={NextButtonHandler4}>ゲーム4から結果発表に<br />進めるようにする</button>

                    </div>
                </div>
                <p className={styles.tpmg5}>　</p>

            </div >
        </>

    );

}
