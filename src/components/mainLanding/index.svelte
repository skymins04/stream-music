<script lang="ts">
  import { FLAG_PAGE_SELECTER } from "../common/stores";
</script>

<div id="main-landing">
  <div class="viewport">
    <div class="header">
      <div class="header-left">
        <h1>STREAM-MUSIC</h1>
      </div>
      <div class="header-right">
        <div class="link">ABOUT</div>
        <div class="link">CONTACT-US</div>
        <div
          class="link"
          on:click={() => {
            FLAG_PAGE_SELECTER.set(1);
          }}
        >
          SERVICE
        </div>
        <div class="link btn">LOGIN</div>
      </div>
    </div>
    <div class="article">
      <div class="section">
        <h1>STREAMING YOUR PLAYLIST</h1>
        <p>
          STREAM-MUSIC은 자동화된 시스템으로 스트리머의 YouTube, 로컬 음원
          파일로 구성된 PlayList를 라이브 스트리밍하여 더 향상된 음악 방송과
          시청자 경험을 만듭니다.
        </p>
        <div class="btns">
          <div class="btn primary">시작하기</div>
          <div class="btn">더 알아보기</div>
        </div>
        <div class="img-slider">
          <div class="imgs">
            <img src="/img/mainlanding-img1.png" alt="" />
            <img src="/img/mainlanding-img2.png" alt="" />
          </div>
        </div>
      </div>
      <div class="section">
        <h2>STREAM-MUSIC 주요 기능</h2>
        <div class="grid">
          <div class="item">
            <svg
              class="icon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              ><path
                d="M512 256C512 397.4 397.4 512 256 512C114.6 512 0 397.4 0 256C0 114.6 114.6 0 256 0C397.4 0 512 114.6 512 256zM256 64C238.3 64 224 78.33 224 96C224 113.7 238.3 128 256 128C273.7 128 288 113.7 288 96C288 78.33 273.7 64 256 64zM256 416C291.3 416 320 387.3 320 352C320 334.6 313.1 318.9 301.9 307.4L365.1 161.7C371.3 149.5 365.8 135.4 353.7 130C341.5 124.7 327.4 130.2 322 142.3L257.9 288C257.3 288 256.6 287.1 256 287.1C220.7 287.1 192 316.7 192 352C192 387.3 220.7 416 256 416V416zM144 112C126.3 112 112 126.3 112 144C112 161.7 126.3 176 144 176C161.7 176 176 161.7 176 144C176 126.3 161.7 112 144 112zM96 288C113.7 288 128 273.7 128 256C128 238.3 113.7 224 96 224C78.33 224 64 238.3 64 256C64 273.7 78.33 288 96 288zM416 224C398.3 224 384 238.3 384 256C384 273.7 398.3 288 416 288C433.7 288 448 273.7 448 256C448 238.3 433.7 224 416 224z"
              /></svg
            ><span class="title">Dashboard</span>
            <p>
              플레이리스트를 재생하고 관리할 수 있는 깔끔한 UI입니다.
              YouTube음원과 로컬파일음원을 모두 재생할 수 있는 통합 플레이어를
              제공합니다.
            </p>
          </div>
          <div class="item">
            <svg
              class="icon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              ><path
                d="M511.1 367.1c0 44.18-42.98 80-95.1 80s-95.1-35.82-95.1-79.1c0-44.18 42.98-79.1 95.1-79.1c11.28 0 21.95 1.92 32.01 4.898V148.1L192 224l-.0023 208.1C191.1 476.2 149 512 95.1 512S0 476.2 0 432c0-44.18 42.98-79.1 95.1-79.1c11.28 0 21.95 1.92 32 4.898V126.5c0-12.97 10.06-26.63 22.41-30.52l319.1-94.49C472.1 .6615 477.3 0 480 0c17.66 0 31.97 14.34 32 31.99L511.1 367.1z"
              /></svg
            ><span class="title">Playlist</span>
            <p>
              YouTube음원와 로컬파일음원(MP3, WAV, FLAC)으로 플레이리스트를
              구성하고 재생할 수 있으며, 파일로 내보내거나 가져올 수 있습니다.
            </p>
          </div>
          <div class="item">
            <svg
              class="icon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 576 512"
              ><path
                d="M160.9 59.01C149.3 52.6 134.7 56.76 128.3 68.39C117.6 87.6 112 109.4 112 131.4c0 19.03 4.031 37.44 11.98 54.62c4.047 8.777 12.73 13.93 21.8 13.93c3.375 0 6.797-.7187 10.05-2.219C167.9 192.2 173.1 177.1 167.5 165.9C162.5 155.1 160 143.5 160 131.4c0-13.93 3.547-27.69 10.25-39.81C176.7 80.04 172.5 65.42 160.9 59.01zM62.61 2.363C46.17-4.32 27.58 3.676 20.95 20.02C7.047 54.36 0 90.69 0 127.1C0 165.3 7.047 201.7 20.95 236C25.98 248.5 37.97 256 50.63 256C54.61 256 58.69 255.3 62.61 253.7C79 247 86.91 228.4 80.27 212C69.47 185.3 64 157.1 64 128c0-29.06 5.469-57.3 16.27-83.99C86.91 27.64 79 8.988 62.61 2.363zM555 20.02c-6.609-16.41-25.23-24.31-41.66-17.66c-16.39 6.625-24.3 25.28-17.66 41.65C506.5 70.7 512 98.95 512 128c0 29.06-5.469 57.31-16.27 83.1C489.1 228.4 497 247 513.4 253.7C517.3 255.3 521.4 256 525.4 256c12.66 0 24.64-7.562 29.67-20C568.1 201.7 576 165.3 576 127.1C576 90.69 568.1 54.36 555 20.02zM420.2 58.23c-12.03 5.562-17.28 19.81-11.72 31.84C413.5 100.9 416 112.5 416 124.6c0 13.94-3.547 27.69-10.25 39.81c-6.422 11.59-2.219 26.22 9.375 32.62c3.688 2.031 7.672 3 11.61 3c8.438 0 16.64-4.47 21.02-12.37C458.4 168.4 464 146.6 464 124.6c0-19.03-4.031-37.43-11.98-54.62C446.5 57.89 432.1 52.7 420.2 58.23zM301.8 65.45C260.5 56.78 224 88.13 224 128c0 23.63 12.95 44.04 32 55.12v296.9c0 17.67 14.33 32 32 32s32-14.33 32-32V183.1c23.25-13.54 37.42-40.96 30.03-71.18C344.4 88.91 325 70.31 301.8 65.45z"
              /></svg
            ><span class="title">Streaming</span>
            <p>
              OBS, XSplit 등의 방송송출프로그램을 통해 플레이리스트를 스트리밍할
              수 있습니다. 자동으로 플레이리스트를 업데이트하여 보여줍니다.
            </p>
          </div>
          <div class="item">
            <svg
              class="icon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 384 512"
              ><path
                d="M224 128L224 0H48C21.49 0 0 21.49 0 48v416C0 490.5 21.49 512 48 512h288c26.51 0 48-21.49 48-48V160h-127.1C238.3 160 224 145.7 224 128zM176 404c0 10.75-12.88 15.98-20.5 8.484L120 376H76C69.38 376 64 370.6 64 364v-56C64 301.4 69.38 296 76 296H120l35.5-36.5C163.1 251.9 176 257.3 176 268V404zM224 387.8c-4.391 0-8.75-1.835-11.91-5.367c-5.906-6.594-5.359-16.69 1.219-22.59C220.2 353.7 224 345.2 224 336s-3.797-17.69-10.69-23.88c-6.578-5.906-7.125-16-1.219-22.59c5.922-6.594 16.05-7.094 22.59-1.219C248.2 300.5 256 317.8 256 336s-7.766 35.53-21.31 47.69C231.6 386.4 227.8 387.8 224 387.8zM320 336c0 41.81-20.5 81.11-54.84 105.1c-2.781 1.938-5.988 2.875-9.145 2.875c-5.047 0-10.03-2.375-13.14-6.844c-5.047-7.25-3.281-17.22 3.969-22.28C272.6 396.9 288 367.4 288 336s-15.38-60.84-41.14-78.8c-7.25-5.062-9.027-15.03-3.98-22.28c5.047-7.281 14.99-9.062 22.27-3.969C299.5 254.9 320 294.2 320 336zM256 0v128h128L256 0z"
              /></svg
            >
            <span class="title">Support Local Audio File</span>
            <p>
              타 플랫폼에서는 지원하지 않는 로컬파일음원 재생을 제공합니다. MP3,
              WAV, FLAC 파일 형식을 지원합니다.
            </p>
          </div>
          <div class="item">
            <svg
              class="icon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              ><path
                d="M256 0C397.4 0 512 114.6 512 256C512 397.4 397.4 512 256 512C201.7 512 151.2 495 109.7 466.1C95.2 455.1 91.64 436 101.8 421.5C111.9 407 131.8 403.5 146.3 413.6C177.4 435.3 215.2 448 256 448C362 448 448 362 448 256C448 149.1 362 64 256 64C202.1 64 155 85.46 120.2 120.2L151 151C166.1 166.1 155.4 192 134.1 192H24C10.75 192 0 181.3 0 168V57.94C0 36.56 25.85 25.85 40.97 40.97L74.98 74.98C121.3 28.69 185.3 0 255.1 0L256 0zM256 128C269.3 128 280 138.7 280 152V246.1L344.1 311C354.3 320.4 354.3 335.6 344.1 344.1C335.6 354.3 320.4 354.3 311 344.1L239 272.1C234.5 268.5 232 262.4 232 256V152C232 138.7 242.7 128 256 128V128z"
              /></svg
            >
            <span class="title">History</span>
            <p>
              재생했던 음원들의 히스토리 기능을 제공합니다. 이전에 재생했던
              음원들은 간편하게 플레이리스트에 추가하세요!
            </p>
          </div>
        </div>
      </div>
      <div class="section">© 2022 STREAM-MUSIC. All rights reserved.</div>
    </div>
  </div>
</div>

<style lang="scss">
  #main-landing {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    background-image: url(/img/mainlanding-bg.png);
    background-position: center center;
    background-repeat: no-repeat;
    overflow-y: auto;
    overflow-x: hidden;

    .viewport {
      position: relative;
      width: 100%;
      max-width: 1000px;
      height: 100%;
      margin: 0 auto;
      padding: 20px;

      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: nowrap;

        .header-left {
          h1 {
            color: white;
            white-space: nowrap;
          }
        }
        .header-right {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 1em;
          flex-wrap: nowrap;

          .link {
            color: white;
            white-space: nowrap;
          }
          .link:hover {
            cursor: pointer;
            font-weight: 300;
          }
        }
      }

      .article {
        position: relative;
        width: 100%;

        .section {
          position: relative;
          width: 100%;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          flex-direction: column;
          padding-left: 20px;
          padding-right: 20px;

          * {
            color: white;
            text-align: center;
          }

          h1 {
            white-space: nowrap;
            font-size: 3em !important;
            margin-bottom: 0;
          }

          h2 {
            white-space: nowrap;
            font-size: 2em !important;
          }

          p {
            margin-top: 10px;
          }

          .btns {
            display: flex;
            justify-content: center;
            align-items: center;
            flex-wrap: nowrap;
            gap: 10px;
            margin: 40px auto;

            .btn {
              padding: 1em;
              border: 1px solid white;
              border-radius: 8px;
              display: flex;
              justify-content: center;
              align-items: center;
            }
            .btn:hover {
              cursor: pointer;
            }

            .btn.primary {
              background-color: white;
              color: var(--color1);
              font-weight: 400;
            }
          }

          .img-slider {
            position: relative;
            width: 100%;
            max-width: 600px;
            overflow: hidden;
            box-shadow: 0 0 10px black;

            .imgs {
              position: relative;
              width: 200%;
              display: flex;
              justify-items: center;
              align-items: center;
              flex-direction: row;
              flex-wrap: nowrap;

              img {
                width: 50%;
              }
            }
          }

          .grid {
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: row;
            flex-wrap: wrap;
            gap: 10px;
            width: 100%;
            max-width: 100%;

            .item {
              width: 30%;
              height: 250px;
              display: flex;
              justify-content: flex-start;
              align-items: center;
              flex-direction: column;
              margin-top: 50px;
              gap: 10px;

              .icon {
                width: 60px;
                min-width: 60px;
                height: 60px;
                min-height: 60px;
                fill: var(--color1);
              }

              .title {
                color: black !important;
                font-size: 20px;
                font-weight: 100;
              }

              p {
                font-size: 16px !important;
                color: #555 !important;
                line-height: 2em;
              }
            }
          }
        }
      }
      .section:nth-child(1) {
        max-width: 600px;
        margin: 0 auto;
        padding-top: 50px;
        height: 1000px;
        overflow: hidden;
      }
      .section:nth-child(2),
      .section:nth-child(3) {
        position: relative;
        left: -100%;
        background-color: white;
        box-sizing: content-box;
        padding: 50px 100%;
        border-bottom: 1px solid #ccc;

        * {
          color: var(--color1) !important;
        }

        h2 {
          padding-bottom: 30px;
          border-bottom: 1px solid #ccc;
        }

        .grid {
          margin-bottom: 20px;
        }
      }
    }
  }
</style>
