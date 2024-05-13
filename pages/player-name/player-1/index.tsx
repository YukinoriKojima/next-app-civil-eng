import React from "react";
import axios from "axios";
import { useState } from "react";
import { ChangeEventHandler } from "react";
import { MouseEventHandler } from "react";
import { FormEventHandler } from "react";
import styles from "../../../styles/Home.module.css";
import Select from "react-select";
import Link from "next/link";
import LocalImage from "../../../images/regional_point-07.png";
import Image from "next/image";

const initialName: string = "Unknown";

const createApiUrl = String(process.env.NEXT_PUBLIC_CREATE_API_URL);
const setApiUrl = String(process.env.NEXT_PUBLIC_SET_API_URL);
const bulkGetApiUrl = String(process.env.NEXT_PUBLIC_BULK_GET_API_URL);
const bulkSetApiUrl = String(process.env.NEXT_PUBLIC_BULK_SET_API_URL);
const getApiUrl = String(process.env.NEXT_PUBLIC_GET_API_URL);

export default function SettingName() {
  const [name, setName] = useState("");
  const [answer, setAnswer] = useState("");
  const [status, setStatus] = useState("typing");
  const [region, setRegion] = useState("");

  const handleTextareaChange: ChangeEventHandler<HTMLTextAreaElement> = ({
    target: { value },
  }) => {
    setAnswer(value);
  };

  const handleSubmit: FormEventHandler = async (event) => {
    event.preventDefault();

    const tmpName = await axios.get(getApiUrl, {
      params: {
        crossDomein: true,
        sheetName: "currentGame",
        cellId: "A1",
      },
    });

    var gameName: string = tmpName.data;

    setStatus("submitting");
    setName(answer);

    try {
      const data = await axios.get(setApiUrl, {
        params: {
          crossDomein: true,
          sheetName: gameName,
          cellId: "A2",
          value: answer,
        },
      });
    } catch (error) {
      alert("Fool You !");
    }
    setStatus("typing");
  };

  type RegionName = {
    value: string;
    label: string;
  };

  const Regions: readonly RegionName[] = [
    { value: "north", label: "北日本" },
    { value: "mid", label: "中日本" },
    { value: "south", label: "西日本" },
  ];

  const selectChenge = async (e: any) => {
    const tmpName = await axios.get(getApiUrl, {
      params: {
        crossDomein: true,
        sheetName: "currentGame",
        cellId: "A1",
      },
    });
    var gameName: string = tmpName.data;
    var tmpRegion = e.label;
    const data = axios.get(setApiUrl, {
      params: {
        crossDomein: true,
        sheetName: gameName,
        cellId: "B2",
        value: e.value,
      },
    });
    setRegion(tmpRegion);
  };

  const confirmButton: MouseEventHandler<HTMLButtonElement> = async () => {};

  return (
    <>
      <div className={styles.container}>
        <p className={styles.btmg5}>　</p>
        <div className={styles.main}>
          <div className={styles.pagetitlebox}>
            <h1>
              Player 1<br />
              名前変更
            </h1>
          </div>
          <p className={styles.normaltextleft}>
            <strong>地域について</strong>
            <br />
            <br />
            今回のゲームでは，11件目から15件目の入札の際に、「地域性」を導入します。
            <br />
            <br />
            現実の世界において、例えば福岡県での工事があるとします。このとき、全国の工事会社が平等な条件にあるわけではなく、
            機材や原料調達、ノウハウの有無など、福岡県や九州地方の企業が有利になります。
            このように、工事現場に近い企業が有利になるということが現実には考えられます。
            <br />
            <br />
            今回は、日本を「北日本」「中日本」「西日本」の3地域に分割し、皆さんに自分の会社の所在地を選択していただきます。
            <br />
            入札11~15では，他の入札のように一番低い価格を入札した人が落札権を手にするのではなく，
            以下のような落札ポイントが高い参加者が落札できます。
            <br />
            <br />
            <strong>
              落札ポイント＝ [ 10 × (3人の中での最高入札額) / (あなたの入札額)]
              + (地域ポイント)
            </strong>
            <br />
            <br />
            入札額が分母にあるので、入札額が低いほど落札しやすいのは他と同じです。しかし、「地域ポイント」が存在しています。
            地域ポイントは以下のようにして決まります。
            <br />
            <br />
          </p>
          <center>
            <Image src={LocalImage} alt="地域ポイント" />
          </center>
          <br />
          <p className={styles.normaltextleft}>
            例えば、工事の条件が
            <br />
            最低価格：5億円、最高価格：10億円、入札経費：1億円、工事費：3億円、場所：西日本
            <br />
            で、各社の入札・地域が
            <br />
          </p>
          <p className={styles.normaltextcenter}>
            A社：3億円・北日本
            <br />
            B社：8億円・西日本
            <br />
            C社：6億円・中日本
            <br />
          </p>
          <p className={styles.normaltextleft}>の場合、落札ポイントは</p>
          <p className={styles.normaltextcenter}>
            <br />
            A社：8億/3億＋1=3.33
            <br />
            B社：8億/8億＋3=4
            <br />
            C社：8億/6億＋2=3.33
            <br />
          </p>
          <p className={styles.normaltextleft}>
            <br />
            で、B社は5~10億円に収まっているため、B社が8億円で落札できます。
            <br />
            以上を踏まえて、名前と地域を選択しましょう！
          </p>
          <table className={styles.table}>
            <tbody>
              <tr>
                <td className={styles.cell}>
                  <h1>あなたの名前は「{name}」です</h1>
                  <form onSubmit={handleSubmit} className={styles.form}>
                    <p>
                      <textarea
                        disabled={status === "submitting"}
                        onChange={handleTextareaChange}
                        value={answer}
                        className={styles.textarea}
                      />
                    </p>

                    <button
                      disabled={status === "empty" || status === "submitting"}
                      className={styles.btn}
                    >
                      名前変更
                    </button>
                  </form>
                </td>
                <td className={styles.cell}>
                  <h1>あなたの地域は{region}です</h1>
                  <Select
                    options={Regions}
                    onChange={selectChenge}
                    className={styles.pulldown}
                  />
                </td>
              </tr>
            </tbody>
          </table>
          <br />
          <div>
            {region != "" && name != "" ? (
              <Link href="../../turn-1/submit/player-1">
                <button className={styles.btn}>次へ進む</button>
              </Link>
            ) : (
              <p>名前と地域の両方を設定してください</p>
            )}
          </div>
        </div>
        <p className={styles.tpmg5}>　</p>
      </div>
    </>
  );
}
