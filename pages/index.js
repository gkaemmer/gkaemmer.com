import Head from "next/head";
import { observer } from "mobx-react";
import Field from "../lib/field";
import { Github, Twitter, LinkedIn } from "../lib/icons";

const HappyCry = () => (
  <span className="face">
    <style jsx>{`
      span.face {
        display: inline-block;
        position: relative;
        cursor: pointer;
      }
      span.tear {
        transform: translateX(-30%) translateY(10%) scale(0.3);
        position: absolute;
        top: 0;
        left: 0;
        transition: opacity 0.5s, transform 0.5s;
      }
      span.face:hover span.tear {
        opacity: 0;
        transform: translateX(-30%) translateY(25%) scale(0.2);
      }
      span.blush {
        position: absolute;
        transition: opacity 0.2s;
      }
      span.face:hover span.blush {
        opacity: 0;
      }
    `}</style>
    <span className="blush">😊</span>
    <span className="smile">😃</span>
    <span className="tear">💧</span>
  </span>
);

const Legend = observer(({ field }) => (
  <div className="field" onClick={() => field.change()}>
    <style jsx>{`
      .field {
        cursor: pointer;
        color: #bbb;
        position: absolute;
        bottom: 0;
        right: 0;
        padding: 10px;
        font-size: 10pt;
      }
      .grad,
      .paren,
      .equals {
        color: #ddd;
      }
    `}</style>
    <span className="grad">∇</span>
    <span className="f">f</span>
    <span className="equals">=</span>
    <span className="paren">(</span>
    <span>{field ? field.xFuncName : "??"}</span>
    <span className="comma">,</span>
    <span>{field ? field.yFuncName : "??"}</span>
    <span className="paren">)</span>
  </div>
));

export default class Index extends React.Component {
  componentDidMount() {
    this.field = new Field("background");
    this.field.start();
    this.forceUpdate();
  }

  render() {
    return (
      <div>
        <style global jsx>{`
          body {
            font-family: Lato, Helvetica, sans-serif;
            font-weight: 300;
            color: #333;
            margin: 0;
          }
        `}</style>
        <style global jsx>{`
          h1,
          h2,
          h3 {
            padding: 0 20px;
            text-align: center;
            margin: 0;
          }
          h1 {
            font-size: 36pt;
            font-weight: 700;
          }
          @media screen and (max-width: 768px) {
            h1 {
              font-size: 42pt;
            }
            h1 span {
              font-size: 36pt;
              display: block;
            }
          }
          h1 span {
          }
          h1 span,
          h2,
          h3 {
            font-weight: 300;
          }
          h2 {
            font-size: 24pt;
          }
          h3 {
            font-size: 16pt;
          }
          .container {
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
          }
          canvas {
            position: absolute;
            width: 100%;
            height: 100%;
          }
          .footer {
            position: absolute;
            bottom: 0;
            font-size: 80%;
            color: #666;
            font-weight: 400;
            overflow: hidden;
          }
          .contact {
            margin: 0 20px;
            line-height: 1.6em;
          }
          .contact span {
            color: #aaa;
          }
          .contact a {
            color: #2950c3;
          }
          .contact svg {
            width: 12px;
            height: 12px;
          }
        `}</style>
        <Head>
          <title>Graham Kaemmer</title>
          <meta
            name="description"
            content="I'm Graham. I like to build things for human people."
          />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/static/favicon.ico" />
          <link
            href="https://fonts.googleapis.com/css?family=Lato:300,400,700"
            rel="stylesheet"
          />
        </Head>
        <canvas id="background" />
        <div className="container">
          <div>
            <h1>
              Hello. <span>I'm Graham.</span>
            </h1>
            <div style={{ height: 30 }} />
            <h2>I like to build things.</h2>
            <div style={{ height: 75 }} />

            <h3>
              I also like to run 🏃, eat burritos 🌯, and cry during good movies{" "}
              <HappyCry />.
            </h3>
            <div style={{ height: 30 }} />
          </div>
        </div>
        <div className="footer">
          <div className="contact">
            <p>
              Graham Kaemmer<br />
              Developer<br />
              graham <span>(at)</span> gkaemmer.com
            </p>
            <p>
              <a href="https://github.com/gkaemmer">
                <Github color={"#2950c3"}/>
              </a>{" "}
              &nbsp;{" "}
              <a href="https://www.linkedin.com/pub/graham-kaemmer/33/727/363">
                <LinkedIn color={"#2950c3"}/>
              </a>{" "}
              &nbsp;{" "}
              <a href="https://twitter.com/grahamkaemmer">
                <Twitter color={"#2950c3"}/>
              </a>{" "}
              &nbsp;{" "}
            </p>
          </div>
        </div>
        <Legend field={this.field} />
      </div>
    );
  }
}
