import * as chaiModule from "chai";
import chaiHttp from "chai-http";
import { describe, it } from "mocha";
import { expect } from "chai";

const server = "http://localhost:5000";
const chai = chaiModule.use(chaiHttp);

import { signupTestCases } from "./testCases/signup.js";
import { loginTestCases } from "./testCases/login.js";

describe("POST - /api/auth/signup", () => {
    signupTestCases.forEach(
        ({ name, payload, expectedStatus, expectedMessage, expectedData }) => {
            it(name, async () => {
                const res = await chai.request
                    .execute(server)
                    .post("/api/auth/signup")
                    .send(payload);
                expect(res).to.have.status(expectedStatus);
                expect(res.body).to.have.property("MESSAGE", expectedMessage);
                expect(res.body).to.have.haveOwnProperty("DATA");
            });
        },
    );
});

describe("POST - /api/auth/login", () => {
    loginTestCases.forEach(
        ({ name, payload, expectedStatus, expectedMessage, expectedData }) => {
            it(name, async () => {
                const res = await chai.request
                    .execute(server)
                    .post("/api/auth/login")
                    .send(payload);
                expect(res).to.have.status(expectedStatus);
                if (expectedStatus != 401)
                    expect(res.body).to.have.property(
                        "MESSAGE",
                        expectedMessage,
                    );
                if (expectedStatus == 200) {
                    expect(res.body).to.haveOwnProperty("DATA");
                    expect(res.body.DATA).to.be.an("object");

                    expect(res.body.DATA).to.haveOwnProperty("roleID");
                    expect(res.body.DATA).to.haveOwnProperty("TOKEN");
                    expect(res.body.DATA).to.haveOwnProperty("USER");

                    expect(res.body.DATA.USER).to.be.an("object");
                    expect(res.body.DATA.USER).to.haveOwnProperty("userEmail");
                    expect(res.body.DATA.USER).to.haveOwnProperty("userName");
                    expect(res.body.DATA.USER).to.haveOwnProperty("rollNumber");
                    expect(res.body.DATA.USER).to.haveOwnProperty(
                        "phoneNumber",
                    );
                    expect(res.body.DATA.USER).to.haveOwnProperty(
                        "collegeName",
                    );
                    expect(res.body.DATA.USER).to.haveOwnProperty(
                        "collegeCity",
                    );
                    expect(res.body.DATA.USER).to.haveOwnProperty(
                        "userDepartment",
                    );
                    expect(res.body.DATA.USER).to.haveOwnProperty(
                        "academicYear",
                    );
                    expect(res.body.DATA.USER).to.haveOwnProperty("degree");
                    expect(res.body.DATA.USER).to.haveOwnProperty("isAmrita");
                } else if (expectedStatus != 401) {
                    expect(res.body).to.haveOwnProperty("DATA");
                }
            });
        },
    );
});
