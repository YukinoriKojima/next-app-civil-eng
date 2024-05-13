import styles from "../styles/Home.module.css";
import Link from "next/link";
import { MouseEventHandler } from "react";
import axios from "axios";
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
            <h1>
              入札
              <br />
              シミュレーションゲーム
            </h1>
          </div>
        </div>
        <br />
        <p className={styles.normaltextcenter}>
          みなさんには架空の建設会社を設立、なるべく多くの利益の獲得を目指して、
          <br />
          建設事業20件の入札に挑戦していただきます。
          <br />
          競合する他社の動向を予想しながら、事業の落札・利益の獲得を目指しましょう。
          <br />
          目指すは建設業界No.1！
        </p>
        <br />
        <Link href="player-select">
          <button className={styles.btn} type="button" onClick={startGame}>
            <div className={styles.large}>Game Start!</div>
          </button>
        </Link>
      </div>
      <p className={styles.tpmg5}>　</p>
    </div>
  );
}
