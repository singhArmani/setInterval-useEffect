import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";

import styled from "styled-components";

import "./styles.css";

const H1 = styled.h1`
  color: palevioletred;
`;

const H3 = styled.h3`
  font-family: monospace;
  font-size: 1em;
`;

// Ref: https://reactjs.org/docs/hooks-faq.html#what-can-i-do-if-my-effect-dependencies-change-too-often
function CounterWithBug() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setCount(count + 1), 1000); // ✅ This doesn't depend on `count` variable outside
    return () => clearInterval(id);
  }, []); // 🔴 Bug: `count` is not specified as a dependency

  return <H3>Counter without passing 'count' dependency: {count}</H3>;
}

function CounterWithNewIntervalEveryRender() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setCount(count + 1), 1000); // ✅ This doesn't depend on `count` variable outside
    return () => {
      clearInterval(id);
    };
  });
  return <H3>Counter with new interval every re-render: {count}</H3>;
}

function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log("setting up new interval");

    const id = setInterval(() => setCount(c => c + 1), 1000); // ✅ This doesn't depend on `count` variable outside
    return () => console.log("cleanup") || clearInterval(id);
    // we if we pass the count dependency;
    // Now, it will clear and set the new interval everytime count is changed and it might not be
    // desirable
  }, []);

  return <H3>Counter with stable setter: {count}</H3>;
}

function CounterWithRef() {
  const [count, setCount] = useState(0);

  // putting fresh count into the latestCount box ✅
  const latestCount = useRef();

  // here every new scheduled effect has fresh value of count. Right :)✅
  useEffect(() => {
    latestCount.current = count;
  });

  // effects run in the order they are invoked ✅
  useEffect(() => {
    function tick() {
      setCount(latestCount.current + 1);
    }
    const intervalId = setInterval(tick, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return <H3>Counter with useRef: {count}</H3>;
}

function App() {
  return (
    <div className="App">
      <H1>setInterval Demystifying </H1>
      <CounterWithBug />
      <CounterWithNewIntervalEveryRender />
      <Counter />
      <CounterWithRef />
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
