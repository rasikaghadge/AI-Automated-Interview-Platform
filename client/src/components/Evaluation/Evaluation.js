import React, { useState } from 'react';
import "./Evaluation.module.css";
import styles from "./Evaluation.module.css";

function Evaluation() {
    return (
        <div className={styles["container"]}>
        <aside>
            <div className={styles["profile"]}>
                <div className={styles["top"]}>
                    <div className={styles["profile-photo"]}>
                        <img src="./images/profile-1.jpg" alt=""/>
                    </div>
                    <div className={styles["info"]}>
                        <p>Hey, <b>Alex</b> </p>
                        <small className={styles["text-muted"]}>12102030</small>
                    </div>
                </div>
                <div className={styles["about"]}>
                    <h5>Course</h5>
                    <p>BTech. Computer Science & Engineering</p>
                    <h5>DOB</h5>
                    <p>29-Feb-2020</p>
                    <h5>Contact</h5>
                    <p>1234567890</p>
                    <h5>Email</h5>
                    <p>unknown@gmail.com</p>
                    <h5>Address</h5>
                    <p>Ghost town Road, New York, America</p>
                </div>
            </div>
        </aside>

        <main>
            <h1>Score</h1>
            <div className={styles["subjects"]}>
                <div className={styles["eg"]}>
                    <span className={styles["materials-icon-sharp"]}>architecture</span>
                    <h3>Engineering Graphics</h3>
                    <h2>12/14</h2>
                    <div className={styles["progress"]}>
                        <svg><circle cx="38" cy="38" r="36"></circle></svg>
                        <div className={styles["number"]}><p>86%</p></div>
                    </div>
                    <small className={styles["text-muted"]}>Last 24 Hours</small>
                </div>
                <div className="mth">
                    <span className={styles["materials-icon-sharp"]}>functions</span>
                    <h3>Mathematical Engineering</h3>
                    <h2>27/29</h2>
                    <div className={styles["progress"]}>
                        <svg><circle cx="38" cy="38" r="36"></circle></svg>
                        <div className={styles["number"]}><p>93%</p></div>
                    </div>
                    <small className={styles["text-muted"]}>Last 24 Hours</small>
                </div>
                <div className="cs">
                    <span className={styles["materials-icon-sharp"]}>computer</span>
                    <h3>Computer Architecture</h3>
                    <h2>27/30</h2>
                    <div className={styles["progress"]}>
                        <svg><circle cx="38" cy="38" r="36"></circle></svg>
                        <div className={styles["number"]}><p>81%</p></div>
                    </div>
                    <small className={styles["text-muted"]}>Last 24 Hours</small>
                </div>
                <div className="cg">
                    <span className={styles["materials-icon-sharp"]}>dns</span>
                    <h3>Database Management</h3>
                    <h2>24/25</h2>
                    <div className={styles["progress"]}>
                        <svg><circle cx="38" cy="38" r="36"></circle></svg>
                        <div className={styles["number"]}><p>96%</p></div>
                    </div>
                    <small className={styles["text-muted"]}>Last 24 Hours</small>
                </div>
                <div className="net">
                    <span className={styles["materials-icon-sharp"]}>router</span>
                    <h3>Network Security</h3>
                    <h2>25/27</h2>
                    <div className={styles["progress"]}>
                        <svg><circle cx="38" cy="38" r="36"></circle></svg>
                        <div className={styles["number"]}><p>92%</p></div>
                    </div>
                    <small className={styles["text-muted"]}>Last 24 Hours</small>
                </div>
            </div>

            <div className={styles["timetable"]} id="timetable">
                <div>
                    <span id="prevDay">&lt;</span>
                    <h2>Today's Timetable</h2>
                    <span id="nextDay">&gt;</span>
                </div>
                <span className={styles["closeBtn"]} onclick="timeTableAll()">X</span>
                <table>
                    <thead>
                        <tr>
                            <th>Time</th>
                            <th>Room No.</th>
                            <th>Subject</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
            </div>
        </main>

        <div className={styles["right"]}>
            <div className={styles["announcements"]}>
                <h2>Announcements</h2>
                <div className={styles["updates"]}>
                    <div className={styles["message"]}>
                        <p> <b>Academic</b> Summer training internship with Live Projects.</p>
                        <small className={styles["text-muted"]}>2 Minutes Ago</small>
                    </div>
                    <div className={styles["message"]}>
                        <p> <b>Co-curricular</b> Global internship oportunity by Student organization.</p>
                        <small className={styles["text-muted"]}>10 Minutes Ago</small>
                    </div>
                    <div className={styles["message"]}>
                        <p> <b>Examination</b> Instructions for Mid Term Examination.</p>
                        <small className={styles["text-muted"]}>Yesterday</small>
                    </div>
                </div>
            </div>

            <div className={styles["leaves"]}>
                <h2>Teachers on leave</h2>
                <div className={styles["teacher"]}>
                    <div className={styles["profile-photo"]}><img src="./images/profile-2.jpeg" alt=""/></div>
                    <div className={styles["info"]}>
                        <h3>The Professor</h3>
                        <small className={styles["text-muted"]}>Full Day</small>
                    </div>
                </div>
                <div className={styles["teacher"]}>
                    <div className={styles["profile-photo"]}><img src="./images/profile-3.jpg" alt=""/></div>
                    <div className={styles["info"]}>
                        <h3>Lisa Manobal</h3>
                        <small className={styles["text-muted"]}>Half Day</small>
                    </div>
                </div>
                <div className={styles["teacher"]}>
                    <div className={styles["profile-photo"]}><img src="./images/profile-4.jpg" alt=""/></div>
                    <div className={styles["info"]}>
                        <h3>Himanshu Jindal</h3>
                        <small className={styles["text-muted"]}>Full Day</small>
                    </div>
                </div>
            </div>
        </div>
        </div>
    );
}

export default Evaluation;