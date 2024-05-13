import styles from "../../../styles/Home.module.css"
import Link from "next/link"
import { MouseEventHandler } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { useCallback } from "react";
import { unescape } from "querystring";

const createApiUrl = String(process.env.NEXT_PUBLIC_CREATE_API_URL);
const setApiUrl = String(process.env.NEXT_PUBLIC_SET_API_URL);
const bulkGetApiUrl = String(process.env.NEXT_PUBLIC_BULK_GET_API_URL);
const bulkSetApiUrl = String(process.env.NEXT_PUBLIC_BULK_SET_API_URL);
const getApiUrl = String(process.env.NEXT_PUBLIC_GET_API_URL);

export default function Start() {


    const startGame: MouseEventHandler<HTMLButtonElement> = async (event) => {

        const now = String(new Date());

        try {
            alert("開始するとプレイヤーがプレイヤー選択画面に進めるようになります．よろしいですか？")
            const createData = await axios.get(createApiUrl, {
                params: {
                    sheetName: now,
                }
            });
            const setData = await axios.get(setApiUrl, {
                params: {
                    sheetName: 'currentGame',
                    cellId: 'A1',
                    value: now }}
            );
            const setGoNext = await axios.get(setApiUrl, {
                params: {
                    sheetName: now,
                    cellId: 'A17',
                    value: "1" }}
            );
        } catch (error) {
            alert("Fool You !");
        }

        // try {
        //     alert('trying');
        // } catch (error) {
        //     alert("Fool You !");
        // }

    };

    return (
       

        <div className={styles.container}>
            <p className={styles.btmg5}>　</p>
            <div className={styles.main}>
                <div className={styles.pagetitlebox}>
                    <div className={styles.pagetitle}>
                    <h1>入札<br />シミュレーションゲーム<br/>管理者画面1</h1>
                    </div>
                </div>
                <br/>
                <Link href = "result-1">
                <button className={styles.btn} type="button" onClick={startGame}><div className={styles.large}>新規ゲーム作成</div></button>
                </Link>
            </div>
            <p className={styles.tpmg5}>　</p>
        </div>
    );
}

