import styles from "../../styles/Home.module.css";
import Link from "next/link";

export default function selectPlayer() {
  return (
    <div className={styles.container}>
      <p className={styles.btmg5}>　</p>
      <main className={styles.main}>
        <div className={styles.pagetitlebox}>
          <p>
            プレイヤー
            <br />
            選択画面
          </p>
        </div>
        <p className={styles.normaltextleft}>
          入札に入る前に、簡単に入札に関連する用語について説明します
          <br />
          <br />
          <strong>入札経費</strong>
          <br />
          入札を行うために必要な経費です。
          入札経費は事業の落札可否に関わらず、入札すると発生します。
          <br />
          <br />
          <strong>工事原価</strong>
          <br />
          実際に建設工事を行うために要する費用です。工事原価は建設事業ごとに設定されています。
          建設事業を落札した建設会社は、この工事原価を支払い、建設工事を行います。
          <br />
          つまり、建設事業の落札に成功すると、落札金額から入札経費および工事原価を差し引いた金額を、基本利益として得ることになります。
        </p>
        <p className={styles.normaltextcenter}>
          <br />
          基本利益 ＝ 落札金額 − 入札経費 − 工事原価
          <br />
          <br />
        </p>
        <p className={styles.normaltextleft}>
          <strong>最低価格・最高価格</strong>
          <br />
          実際の入札では「この価格より上でないと失格」という最低価格、「この価格より下でないと失格」という最高価格が設定されることがあります。
          <br />
          工事を依頼する側は、あまりにも依頼費用(落札価格)が高いと、コストを負担できなくなります。そのため、最高価格を設けることで、
          負担するコストに上限を設けています。
          <br />
          一方で、あまりにも安い価格で工事を行うと、適切な施工が行われない可能性が高くなります。
          そこで、最低価格を設けることで、落札側（工事をする企業）が適切に工事を実施できるようにしています。
          <br />
          今回の入札ゲームでもこれらを設定しています。
          <br />
        </p>
        <p className={styles.normaltextcenter}>
          <br />
          最高入札価格：工事価格×〇〇%
          <br />
          最低入札価格：工事価格×△△%
          <br />
          <br />
        </p>
        <p className={styles.normaltextleft}>
          それぞれの割合（〇〇%，△△%）は事業1~20で共通です。参加者の皆さんは、自分や他の参加者の入札を見ながら、
          だいたいの割合を予測し、最高価格と最低価格の間に収まるように入札価格を決めなければいけません。
          <br />
          それでは、以下の画面から、プレイヤー名と地域の選択に移りましょう！
        </p>
        <div className={styles.contents}>
          <div className={styles.item}>
            <Link href={"../player-name/player-1"}>
              <button className={styles.btn} type="button">
                Player 1
              </button>
            </Link>
          </div>
          <div className={styles.item}>
            <Link href={"../player-name/player-2"}>
              <button className={styles.btn} type="button">
                Player 2
              </button>
            </Link>
          </div>
          <div className={styles.item}>
            <Link href={"../player-name/player-3"}>
              <button className={styles.btn} type="button">
                Player 3
              </button>
            </Link>
          </div>
          <div className={styles.item}>
            <Link href={"../player-name/player-4"}>
              <button className={styles.btn} type="button">
                Player 4
              </button>
            </Link>
          </div>
        </div>
      </main>
      <p className={styles.tpmg5}>　</p>
    </div>
  );
}
