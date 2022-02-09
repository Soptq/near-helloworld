import * as React from 'react'
import {Client as Styletron} from 'styletron-engine-atomic';
import {Provider as StyletronProvider} from 'styletron-react';
import {LightTheme, BaseProvider, styled} from 'baseui';
import { Heading, HeadingLevel } from 'baseui/heading'
import { Button } from "baseui/button";
import { Block } from 'baseui/block'
import logo from './logo.svg';
import './App.css';
import * as nearAPI from "near-api-js";
import { Input } from "baseui/input"
import { Card, StyledBody, StyledAction } from 'baseui/card';

const engine = new Styletron();
const { providers } = nearAPI;
const provider = new providers.JsonRpcProvider("https://rpc.testnet.near.org");

global.Buffer = global.Buffer || require('buffer').Buffer;

const Centered = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%',
});

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      msg: "",
      result: null,
    };

    this.callContract = this.callContract.bind(this);
  }

  async callContract() {
    let rawResult = await provider.query({
      request_type: "call_function",
      account_id: "helloworld.soptqnft.testnet",
      method_name: "hello",
      args_base64: Buffer.from(`{"name": "${this.state.msg}"}`).toString('base64'),
      finality: "optimistic",
    })
    this.setState({result: JSON.parse(Buffer.from(rawResult.result).toString())});
  }

  render() {
    return (
        <StyletronProvider value={engine}>
          <BaseProvider theme={LightTheme}>
            <Centered>
              <Block width="500px">
                <HeadingLevel>
                  <Heading>Welcome to Helloworld</Heading>
                  <HeadingLevel>
                    <Heading>Input</Heading>
                  </HeadingLevel>
                  <Block marginBottom="10px">
                    <Input
                        value={this.state.msg}
                        onChange={e => {
                          this.setState({msg: e.target.value})
                        }}
                        placeholder="Message"
                        type="text"
                        clearOnEscape
                    />
                  </Block>
                  <Block marginBottom="10px">
                    <Button
                        size="compact"
                        onClick={() => this.callContract()}
                    >Call</Button>
                  </Block>
                  <p>Return: {this.state.result}</p>
                </HeadingLevel>
              </Block>
            </Centered>
          </BaseProvider>
        </StyletronProvider>
    );
  }
}

export default App;
