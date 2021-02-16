import React, {Component} from 'react';
import {UserRegistration, UserEdit} from "../services/RegistrationService";
import {DataService, DeleteEntry} from "../services/DataService";

export default class Data extends Component {

    constructor(props) {
        super(props);
        this.state = {
            form: {
                name: '',
                address: '',
                birthdate: '',
                age: '',
                marital_status: 'Married',
                caste: '',
                add_qualification: '',
                edu_qualification: '',
                experience: '',
                contact: '',
                email: '',
                emp_status: '',
                file_num: '',
                pan_name: '',
                pan_ward: '',
            },
            data: [],
            search: '',
            edit: false,
            printData: {}
        };
    }

    componentDidMount() {
        this.fetchData();
    }

    fetchData = async () => {
        const data = await DataService();
        this.setState({data: data.data});
    }

    handleChange(event) {
        let fieldName = event.target.name;
        let fieldVal = event.target.value;
        this.setState({form: {...this.state.form, [fieldName]: fieldVal}}, () => {
            if (fieldName === 'birthdate') {
                const today = new Date();
                const birthDate = new Date(fieldVal);
                let age = today.getFullYear() - birthDate.getFullYear();
                const m = today.getMonth() - birthDate.getMonth();
                if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                    age--;
                }
                this.setState({form: {...this.state.form, ['age']: age}}, () => {
                })

            }
        })
    }

    handleSearchChange = (event) => {
        this.setState({search: event.target.value});
    }

    // onEdit = (row) => {
    //     console.log($);
    //     window.$('#form').modal('show');
    // }

    onDelete = async (id) => {
        const res = await DeleteEntry(id)
        console.log(res.status);
        if (res.status === 200) {
            await this.fetchData();
        }
    }

    onEdit = async (row) => {
        this.setState({edit: true});
        this.setState({form: row}, () => {
            window.$('#form').modal('show');
        });
    }

    onPrint = async (row) => {
        this.setState({printData: row}, () => {
            let content = document.getElementById("printData");
            let pri = document.getElementById("ifmcontentstoprint").contentWindow;
            pri.document.open();
            pri.document.write(content.innerHTML);
            pri.document.close();
            pri.focus();
            pri.print();
        });
        // window.print();
    }

    // getMaxDate = () => {
    //     return new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().split("T")[0];
    // }

    onSubmit = async e => {
        e.preventDefault();
        const data = {...this.state.form}
        let status;
        console.log(this.state);
        if (!this.state.edit) {
            status = await UserRegistration(data)
        } else {
            status = await UserEdit(data)
        }
        if (status === 200) {
            this.myFormRef.reset();
            this.setState({
                form: {},
                edit: false
            }, () => {
                this.fetchData();
            });
        } else
            this.setState({
                error: true,
                register: false,
            });
        window.$('#form').modal('hide');
    };

    render() {
        let {
            data, search
        } = this.state;

        const print = {
            visibility: 'hidden'
        }

        if (search) {
            data = data.filter((obj) => {
                console.log(obj);
                return Object.keys(obj).some((key) => {
                    return obj[key].toString().toLowerCase().includes(search);
                })
            })
        }
        return (
            <div style={{marginTop: '3rem'}}>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-3">
                            <input type="text" className="form-control" placeholder="search"
                                   onChange={this.handleSearchChange}/>
                        </div>
                        <div className="col-md-3">
                            <button type="button" className="btn btn-danger" data-toggle="modal"
                                    data-target="#form">
                                New Entry
                            </button>
                        </div>
                    </div>

                    <table style={{marginTop: '3rem'}} className="table table-striped table-bordered">
                        <thead>
                        <tr>
                            <th>Sr No</th>
                            <th>Name</th>
                            <th>Address</th>
                            <th>Birth Date</th>
                            <th>Age</th>
                            <th>Marital Status</th>
                            <th>Caste</th>
                            <th>Educational Qualifications</th>
                            <th>Additional Qualifications</th>
                            <th>Experience</th>
                            <th>Employment status</th>
                            <th>Contact No.</th>
                            <th>Email</th>
                            <th>File Number</th>
                            <th>Panchayat Name</th>
                            <th>Panchayat Ward</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            data.map((row, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{index+1}</td>
                                        <td>{row.name}</td>
                                        <td>{row.address}</td>
                                        <td>{row.birthdate}</td>
                                        <td>{row.age}</td>
                                        <td>{row.marital_status}</td>
                                        <td>{row.caste}</td>
                                        <td>{row.edu_qualification}</td>
                                        <td>{row.add_qualification}</td>
                                        <td>{row.experience}</td>
                                        <td>{row.emp_status}</td>
                                        <td>{row.contact}</td>
                                        <td>{row.email}</td>
                                        <td>{row.file_num}</td>
                                        <td>{row.pan_name}</td>
                                        <td>{row.pan_ward}</td>
                                        <td>
                                            <a style={{cursor: 'pointer'}}
                                               onClick={() => this.onDelete(row._id)}>Delete</a>
                                            &nbsp;|&nbsp;
                                            <a style={{cursor: 'pointer'}} onClick={() => this.onEdit(row)}>Edit</a>
                                            &nbsp;|&nbsp;
                                            <a style={{cursor: 'pointer'}}
                                               onClick={() => this.onPrint(row)}>Print</a>
                                        </td>
                                    </tr>
                                )
                            })
                        }

                        </tbody>
                    </table>

                    <div className="modal fade" id="form" role="dialog" aria-labelledby="exampleModalLabel"
                         aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered" role="document">
                            <div className="modal-content">
                                <div className="modal-header border-bottom-0">
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <form ref={(el) => this.myFormRef = el} onSubmit={this.onSubmit}>
                                    <div className="modal-body">
                                        <div className="row">
                                            <div className="col-md-12 form-group">
                                                <label htmlFor="name">Name</label>
                                                <input type="text" className="form-control" id="name"
                                                       name="name"
                                                       value={this.state.form.name}
                                                       placeholder="Enter Name"
                                                       onChange={this.handleChange.bind(this)}/>
                                            </div>
                                            <div className="col-md-12 form-group">
                                                <label htmlFor="password1">Address</label>
                                                <textarea className="form-control" name="address"
                                                          value={this.state.form.address}
                                                          placeholder="Enter Address"
                                                          onChange={this.handleChange.bind(this)}></textarea>
                                            </div>
                                            <div className="col-md-6 form-group">
                                                <label htmlFor="birthday">Birthdate:</label>
                                                <input type="date" className="form-control"
                                                       value={this.state.form.birthdate}
                                                       id="birthdate" name="birthdate"
                                                       onChange={this.handleChange.bind(this)}/>
                                            </div>
                                            <div className="col-md-6 form-group">
                                                <label htmlFor="age">Age</label>
                                                <input type="number" className="form-control"
                                                       value={this.state.form.age}
                                                       id="age"
                                                       placeholder="Enter Age"
                                                       name="age"
                                                       value={this.state.form.age}
                                                       onChange={this.handleChange.bind(this)}/>
                                            </div>
                                            <div className="col-md-6 form-group">
                                                <label htmlFor="marital-sts">Marrital Status</label>
                                                <select id="marital-sts" name="marital_status"
                                                        className="form-control"
                                                        name="marital_status"
                                                        value={this.state.form.marital_status}
                                                        onChange={this.handleChange.bind(this)}>
                                                    <option value="Married">Married</option>
                                                    <option value="Single">Single</option>
                                                    <option value="Divorced">Divorced</option>
                                                    <option value="Separated">Separated</option>
                                                </select>
                                            </div>
                                            <div className="col-md-6 form-group">
                                                <label htmlFor="caste">Caste</label>
                                                <input type="text" name="caste" className="form-control" id="caste"
                                                       placeholder="Enter Caste"
                                                       name="caste"
                                                       value={this.state.form.caste}
                                                       onChange={this.handleChange.bind(this)}/>
                                            </div>
                                            <div className="col-md-6 form-group">
                                                <label htmlFor="edu">Educational Qualification</label>
                                                <input type="text" name="educational_qualification"
                                                       value={this.state.form.edu_qualification}
                                                       className="form-control"
                                                       id="edu"
                                                       name="edu_qualification"
                                                       placeholder="Enter Educational Qualification"
                                                       onChange={this.handleChange.bind(this)}/>
                                            </div>
                                            <div className="col-md-6 form-group">
                                                <label htmlFor="add_qualification">Additional Qualification</label>
                                                <input type="text" name="additional_qualification"
                                                       className="form-control"
                                                       id="add_qualification"
                                                       value={this.state.form.add_qualification}
                                                       name="add_qualification"
                                                       placeholder="Enter Additional Educational Qualification"
                                                       onChange={this.handleChange.bind(this)}/>
                                            </div>
                                            <div className="col-md-6 form-group">
                                                <label htmlFor="emp_stastus">Employement Status</label>
                                                <input type="text" name="emp_status" className="form-control"
                                                       id="exp"
                                                       placeholder="Enter Employement Ststus"
                                                       value={this.state.form.emp_status}
                                                       name="emp_status"
                                                       onChange={this.handleChange.bind(this)}/>
                                            </div>
                                            <div className="col-md-6 form-group">
                                                <label htmlFor="exp">Experience</label>
                                                <input type="text" name="experience" className="form-control"
                                                       id="exp"
                                                       placeholder="Enter Experience"
                                                       value={this.state.form.experience}
                                                       name="experience"
                                                       onChange={this.handleChange.bind(this)}/>
                                            </div>
                                            <div className="col-md-6 form-group">
                                                <label htmlFor="file-num">File Number</label>
                                                <input type="text" className="form-control" id="file-num"
                                                       name="file_num"
                                                       value={this.state.form.file_num}
                                                       placeholder="Enter File Number"
                                                       onChange={this.handleChange.bind(this)}/>
                                            </div>
                                            <div className="col-md-6 form-group">
                                                <label htmlFor="contact">Contact Number</label>
                                                <input type="text" className="form-control" id="contact"
                                                       placeholder="Enter Contact Number"
                                                       value={this.state.form.contact}
                                                       name="contact"
                                                       onChange={this.handleChange.bind(this)}/>
                                            </div>
                                            <div className="col-md-6 form-group">
                                                <label htmlFor="email">Email</label>
                                                <input type="email" className="form-control" id="email"
                                                       placeholder="Enter Email"
                                                       name="email"
                                                       value={this.state.form.email}
                                                       onChange={this.handleChange.bind(this)}/>
                                            </div>
                                            <div className="col-md-6 form-group">
                                                <label htmlFor="pan-name">Panchayat Name</label>
                                                <input type="text" className="form-control" id="pan-name"
                                                       placeholder="Enter Panchayat Name"
                                                       name="pan_name"
                                                       value={this.state.form.pan_name}
                                                       onChange={this.handleChange.bind(this)}/>
                                            </div>
                                            <div className="col-md-6 form-group">
                                                <label htmlFor="pan-ward">Panchayat Ward</label>
                                                <input type="text" className="form-control" id="pan-ward"
                                                       placeholder="Enter Panchayat Ward"
                                                       name="pan_ward"
                                                       value={this.state.form.pan_ward}
                                                       onChange={this.handleChange.bind(this)}/>
                                            </div>
                                        </div>

                                    </div>
                                    <div className="modal-footer border-top-0 d-flex justify-content-center">
                                        <button type="submit" className="btn btn-success">
                                            Submit
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                    <div style={print} id='printData'>
                        <style>
                            {
                                `@media print {
                                    .form-control {
                                        display: block;
                                        width: 100%;
                                        height: 34px;
                                        padding: 6px 12px;
                                        font-size: 14px;
                                        line-height: 1.42857143;
                                        color: #555;
                                        background-color: #fff;
                                        background-image: none;
                                        border: 1px solid #ccc;
                                        border-radius: 4px;
                                        box-shadow: inset 0 1px 1px rgb(0 0 0 / 8%);
                                        -webkit-transition: border-color ease-in-out .15s,box-shadow ease-in-out .15s;
                                        -webkit-transition: border-color ease-in-out .15s,-webkit-box-shadow ease-in-out .15s;
                                        transition: border-color ease-in-out .15s,box-shadow ease-in-out .15s;
                                    }
                                }`
                            }
                        </style>
                        <div className="row">
                            <div className="col-md-12 form-group">
                                <label htmlFor="name">Name</label>
                                <input type="text" className="form-control" id="name"
                                       name="name"
                                       value={this.state.printData.name}/>
                            </div>
                            <br/>
                            <div className="col-md-12 form-group">
                                <label htmlFor="password1">Address</label>
                                <textarea className="form-control" name="address"
                                          value={this.state.printData.address}></textarea>
                            </div>
                            <br/>
                            <div className="col-md-6 form-group">
                                <label htmlFor="birthday">Birthdate:</label>
                                <input type="date" className="form-control"
                                       value={this.state.printData.birthdate}
                                       id="birthdate" name="birthdate"/>
                            </div>
                            <br/>
                            <div className="col-md-6 form-group">
                                <label htmlFor="age">Age</label>
                                <input type="number" className="form-control"
                                       value={this.state.printData.age}
                                       id="age"
                                       name="age"
                                       value={this.state.printData.age}
                                />
                            </div>
                            <br/>
                            <div className="col-md-6 form-group">
                                <label htmlFor="marital-sts">Marrital Status</label>
                                <input id="marital-sts" name="marital_status" className="form-control"
                                        name="marital_status"
                                        value={this.state.printData.marital_status}
                                        >
                                </input>
                            </div>
                            <br/>
                            <div className="col-md-6 form-group">
                                <label htmlFor="caste">Caste</label>
                                <input type="text" name="caste" className="form-control" id="caste"
                                       name="caste"
                                       value={this.state.printData.caste}
                                       onChange={this.handleChange.bind(this)}/>
                            </div>
                            <br/>
                            <div className="col-md-6 form-group">
                                <label htmlFor="edu">Educational Qualification</label>
                                <input type="text" name="educational_qualification"
                                       value={this.state.printData.edu_qualification}
                                       className="form-control"
                                       id="edu"
                                       name="edu_qualification"
                                      />
                            </div>
                            <br/>
                            <div className="col-md-6 form-group">
                                <label htmlFor="add_qualification">Additional Qualification</label>
                                <input type="text" name="additional_qualification" className="form-control"
                                       id="add_qualification"
                                       value={this.state.printData.add_qualification}
                                       name="add_qualification"
                                       />
                            </div>
                            <br/>
                            <div className="col-md-6 form-group">
                                <label htmlFor="emp_stastus">Employement Status</label>
                                <input type="text" name="emp_status" className="form-control" id="exp"
                                       value={this.state.printData.emp_status}
                                       name="emp_status"
                                      />
                            </div>
                            <br/>
                            <div className="col-md-6 form-group">
                                <label htmlFor="exp">Experience</label>
                                <input type="text" name="experience" className="form-control" id="exp"
                                       value={this.state.printData.experience}
                                       name="experience"
                                       />
                            </div>
                            <br/>
                            <div className="col-md-6 form-group">
                                <label htmlFor="file-num">File Number</label>
                                <input type="text" className="form-control" id="file-num"
                                       name="file_num"
                                       value={this.state.printData.file_num}
                                      />
                            </div>
                            <br/>
                            <div className="col-md-6 form-group">
                                <label htmlFor="contact">Contact Number</label>
                                <input type="text" className="form-control" id="contact"
                                       value={this.state.printData.contact}
                                       name="contact"
                                       />
                            </div>
                            <br/>
                            <div className="col-md-6 form-group">
                                <label htmlFor="email">Email</label>
                                <input type="email" className="form-control" id="email"
                                       name="email"
                                       value={this.state.printData.email}
                                      />
                            </div>
                            <br/>
                            <div className="col-md-6 form-group">
                                <label htmlFor="pan-name">Panchayat Name</label>
                                <input type="text" className="form-control" id="pan-name"
                                       name="pan_name"
                                       value={this.state.printData.pan_name}
                                       />
                            </div>
                            <br/>
                            <div className="col-md-6 form-group">
                                <label htmlFor="pan-ward">Panchayat Ward</label>
                                <input type="text" className="form-control" id="pan-ward"
                                       name="pan_ward"
                                       value={this.state.printData.pan_ward}
                                       />
                            </div>
                        </div>
                    </div>

                    <iframe id="ifmcontentstoprint"
                            style={{height: '0px', width: '0px', position: 'absolute'}}></iframe>
                </div>
            </div>
        )
    }
}
