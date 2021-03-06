import * as React from 'react';
import * as ReactDOM from "react-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import {  Row, Col, Tabs, Tab, Table, Form, Button,  Modal } from "react-bootstrap";
import { MessageForm, SignalForm, NetworkNodesForm } from '../../src/candb_provider';
import { SignalInMsg } from './parameters';
import {SelectTransmittersTable} from "../msgComponents/transmitters_select";
import {SelectSignalTable} from "../msgComponents/signal_select";
import {MessageDefinition} from "../msgComponents/definition";
import { ModifyAttribute } from "../commonComponent/attribute_modify"

declare global {
    interface Window {
      acquireVsCodeApi(): any;
    }
}

window.addEventListener('message', (event) =>{
  let vscode = window.acquireVsCodeApi();
  let message = event.data.message;
  let listOfSignal = event.data.signal;
  let listOfNetworknode = event.data.networknode;
  let connectionMsg = event.data.connectionMsg;
  let attributesdefs = event.data.attributesdefs;

  console.log("messageEditor Receieve:：", message.name, listOfSignal.length, connectionMsg, attributesdefs.length);

  // eslint-disable-next-line @typescript-eslint/naming-convention
  const EditorApp = () =>  {
    
    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>): void => {
      const msgKey = e.target.id.split("_")[1];
      message[msgKey] = e.target.value;
    };

    function onSaveBtnClick(): void {
      vscode.postMessage({
        command: 'modifyMsgForm',
        data: message,
        connect: connectionMsg
      });
    }
    
    function onCancelBtnClick(): void {
      vscode.postMessage({
        command: 'cancelMsgForm'
      });
    }
    return (
            <>
            <Tabs defaultActiveKey="definition" id="uncontrolled-tab-example">
                <Tab eventKey="definition" title="Definition">
                  <MessageDefinition  msg = {message}
                                      listOfNetworknode = {listOfNetworknode}
                                      listOfSignal = {listOfSignal}
                                      connection={connectionMsg}/>
                </Tab>
                <Tab eventKey="signals" title="Signals">
                    <SelectSignalTable  msg = {message}
                                        listOfNetworknode = {listOfNetworknode}
                                        listOfSignal = {listOfSignal}
                                        connection={connectionMsg}/>
                </Tab>
                <Tab eventKey="transmitters" title="Transmitters">
                    <SelectTransmittersTable  msg = {message}
                                              listOfNetworknode = {listOfNetworknode}
                                              listOfSignal = {listOfSignal}
                                              connection={connectionMsg}/>
                </Tab>
                <Tab eventKey="receivers" title="Receivers" >
                  <Table  striped bordered hover variant="dark" 
                          className="table table-bordered table-hover"
                          id="tab_logic">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Address</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {(() => {
                        let nonRepeatArray:string[] = [];
                          connectionMsg.connection.map((item:SignalInMsg) => {
                          let idxSignal = listOfSignal.findIndex((s:SignalForm) => s.uid === item.id);
                          if (idxSignal !== -1) {
                            let receivers = listOfSignal[idxSignal].receivers;
                            let uniqueNNs = receivers.filter((nn: NetworkNodesForm) => !nonRepeatArray.includes(nn.uid));
                            uniqueNNs.map((nn: NetworkNodesForm) => nonRepeatArray.push(nn.uid));
                          }
                        });
                        return (
                          nonRepeatArray.map((nnId: string, qqqidx:number) =>{
                            let idx = listOfNetworknode.findIndex((nn:NetworkNodesForm) => nn.uid===nnId);
                            if (idx !== -1){
                              return (
                                  <tr>
                                    <td>{listOfNetworknode[idx].name}</td>
                                    <td>{listOfNetworknode[idx].address}</td>
                                    <td></td>
                                  </tr>
                            );}
                        }));
                      })()}
                    </tbody>
                  </Table>
                </Tab>
                <Tab eventKey="layout" title="Layout" >
                  <Table striped bordered hover variant="dark">
                    <thead>
                      <tr>
                        <th>Value</th>
                        <th>Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>1</td>
                          {Array.from({ length: 3 }).map((_, index) => (
                                  <td key={index}>Table cell {index}</td>
                            ))
                          }
                      </tr>
                      <tr>
                        <td>2</td>
                          {Array.from({ length: 3 }).map((_, index) => (
                                  <td key={index}>Table cell {index}</td>
                            ))
                          }
                      </tr>
                    </tbody>
                  </Table>
                </Tab>
                <Tab eventKey="attributes" title="Attributes" >
                    <ModifyAttribute  item = {message}
                                      attributes = {attributesdefs}
                                      listOfNetworknode = {listOfNetworknode}
                                      listOfSignal = {listOfSignal}
                                      connection={connectionMsg}/>
                    
                </Tab>
                <Tab eventKey="comment" title="Comment" >
                  <Form.Group controlId="_comments">
                    <Form.Control as="textarea" 
                                  rows={30}
                                  defaultValue={ message.comments}
                                  placeholder="Type your comments here ..."
                                  onChange={(event) => handleFormChange(event as any)}/>
                    
                  </Form.Group>
                </Tab>
            </Tabs>
          

            <div style={{margin:"20px"}} className="mb-2">
                <Button variant="success" size="lg" type="save" onClick={onSaveBtnClick}>
                Save
                </Button>{' '}
                <Button   variant="secondary" size="lg"  type="cancel" onClick={onCancelBtnClick}>
                Cancel
                </Button>
            </div>
            
            
            </>
        );
    };

  ReactDOM.render(<EditorApp />, document.getElementById('root'));
});