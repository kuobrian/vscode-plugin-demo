import * as React from 'react';
import * as ReactDOM from "react-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import * as CANDB from "../../src/candb_provider";
import {SelectMsgTable} from "../signalComponents/msg_select";
import {SignalDefinitionEdit} from "../signalComponents/definition";
import { ModifyAttribute } from "../commonComponent/attribute_modify"


import {  Row, Col, Tabs, Tab, Table, Form, Button,  Modal } from "react-bootstrap";

declare global {
    interface Window {
      acquireVsCodeApi(): any;
    }
}

window.addEventListener('message', (event) =>{
  let vscode = window.acquireVsCodeApi();
  let signal = event.data.signal;
  let listOfMsg = event.data.message;
  let listOfNetworknode = event.data.networknode;
  let isPreview = event.data.isPreview;
  let connectionSignal = event.data.connectionSignal;
  let attributesdefs = event.data.attributesdefs;
    

  console.log("SignalEditor Receieve:：", signal.name, listOfMsg.length, attributesdefs);

  const EditorApp = () =>  {
      const [show, setShow] = React.useState(false);

      const handleClose = () => setShow(false);
      const handleShow = () => setShow(true);        
      
      const handleFormChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>): void => {
        const msgKey = e.target.id.split("_")[1];
        signal[msgKey] = e.target.value;
      };

      function onSaveBtnClick(): void {
        vscode.postMessage({
          command: 'modifySignalForm',
          data: signal,
          connect: connectionSignal
        });
      }
      
      function onCancelBtnClick(): void {
        vscode.postMessage({
          command: 'cancelSignalForm'
        });
      }

      return (
              <>
              <Tabs defaultActiveKey="definition" id="uncontrolled-tab-example">
                  <Tab eventKey="definition" title="Definition">
                    <Form >
                        <SignalDefinitionEdit signal = {signal} 
                                              listOfMsg = {listOfMsg}
                                              connection = {connectionSignal}/>
                    </Form>
                  </Tab>
                  <Tab eventKey="messages" title="Messages">
                    <Form>
                        <SelectMsgTable signal={signal}
                                        listOfMsg={listOfMsg}
                                        connection={connectionSignal} />
                    </Form>
                  </Tab>
                                    
                  <Tab eventKey="receivers" title="Receivers">
                    <Table striped bordered hover variant="dark" 
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
                          { 
                            signal.receivers.map((nn: CANDB.NetworkNodesForm) =>{
                            return (
                              <>
                                {  <tr>
                                    <td>{nn.name}</td>
                                    <td>{nn.address}</td>
                                    <td></td>
                                  </tr>
                                }
                              </>
                            );})
                          }
                        </tbody>
                    </Table>
                                      
                  </Tab>
                  <Tab eventKey="attributes" title="Attributes" >
                        <ModifyAttribute  item={signal}
                                          attributes={attributesdefs}
                                          listOfNetworknode={listOfNetworknode}
                                          listOfMsg={listOfMsg}
                                          connection={connectionSignal} />
                    <Row>
                        <Col>
                            <Button variant="secondary" onClick={handleShow} disabled>
                            Read from DB ...
                            </Button>
                            <Modal show={show}
                                    onHide={handleClose}
                                    backdrop="static"
                                    keyboard={false}>
                              <Modal.Header closeButton>
                                <Modal.Title>Modal heading</Modal.Title>
                              </Modal.Header>
                              <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
                                <Modal.Footer>
                                  <Button variant="secondary" onClick={handleClose}>
                                  Close
                                  </Button>
                                  <Button variant="primary" onClick={handleClose}>
                                  Save Changes
                                  </Button>
                                </Modal.Footer>
                            </Modal>
                        </Col>
                        <Col>
                            <Button variant="secondary" onClick={handleShow} disabled>
                            Write to DB
                            </Button>
                        </Col>
                        <Col>
                            <Button variant="secondary" onClick={handleShow} disabled>
                            Reset
                            </Button>
                        </Col>
                      </Row>
                  </Tab>
                  <Tab eventKey="valueDescriptions" title="Value Descriptions" >
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
                  <Tab eventKey="comment" title="Comment" >
                    <Form.Group controlId="_comments">
                      <Form.Control as="textarea" 
                                    rows={30}
                                    defaultValue={ signal.comments}
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