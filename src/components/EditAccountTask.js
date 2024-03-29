import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';
import {
  isSignInPending,
  putFile,
  getFile,
  loadUserData,
  Person,
} from 'blockstack';
import { Redirect } from 'react-router';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import findObjectBy from './util/findObjectBy';
import avatarFallbackImage from '../assets/avatar-placeholder.png';
import ProfileDesktop from './ProfileDesktop';
import Nav from './Nav';
import Form from './styles/Form';
import Error from './ErrorMessage';

class EditAccountTaskPage extends Component {
  state = {
    id: '',
    contactname: '',
    subject: '',
    duedate: '',
    rank: '',
    status: '',
    description: '',
    accounttasks: [],
    contactDate: '',
    created_at: '',
    accounts: [],
    accountsnames: [],
    person: {
      name() {
        return 'Anonymous';
      },
      avatarUrl() {
        return avatarFallbackImage;
      },
    },
    username: '',
    saved: false,
  };

  componentWillMount() {
    this.setState({
      person: new Person(loadUserData().profile),
      username: loadUserData().username,
    });
    this.fetchData();
  }

  fetchData() {
    const options = { decrypt: true };
    getFile('accounttasks.json', options).then(file => {
      const accounttasks = JSON.parse(file || '[]');
      const accounttask = findObjectBy(accounttasks, {
        id: this.props.location.search.substring(4),
      });
      if (!accounttask) {
        this.props.history.push('/accounttasks');
      }
      this.setState({
        accounttasks,
        id: accounttask[0].id,
        contactname: accounttask[0].contactname,
        subject: accounttask[0].subject,
        duedate: accounttask[0].duedate,
        rank: accounttask[0].rank,
        status: accounttask[0].status,
        description: accounttask[0].description,
        contactDate: accounttask[0].contactDate,
        created_at: accounttask[0].created_at,
        priority: accounttask[0].priority,
      });
    });
    getFile('accounts.json', options).then(file => {
      const accounts = JSON.parse(file || '[]');
      const accountsnames = accounts.map((account) => account.accountname);
      this.setState({
        accounts,
        accountsnames,
      });
    });
  }

  deleteContact() {
    const toDelete = this.state.id;
    const newContactsList = this.state.accounttasks.filter(
        accounttask => accounttask.id !== toDelete
    );
    const options = { encrypt: true };
    putFile('accounttasks.json', JSON.stringify(newContactsList), options).then(
      () => {
        this.props.history.push('/accounttasks');
      }
    );
  }

  handleEditContactSubmit(event) {
    event.preventDefault();
    this.saveEditedContact();
  }

  saveEditedContact() {
    let { accounttasks } = this.state;
    const newContact = {
      id: this.state.id,
      contactname: this.state.contactname,
      subject: this.state.subject,
      duedate: this.state.duedate,
      rank: this.state.rank,
      status: this.state.status,
      description: this.state.description,
      priority: this.state.priority,
      contactDate: this.state.contactDate,
      created_at: this.state.created_at,
    };
    // delete the contact with the same ID as the edited one
    accounttasks = accounttasks.filter(accounttask => accounttask.id !== newContact.id);
    // add the edited contact to all contacts
    accounttasks.unshift(newContact);
    const options = { encrypt: true };
    putFile('accounttasks.json', JSON.stringify(accounttasks), options).then(() => {});
    this.setState({
      saved: true,
    });
  }

  handleChange = e => {
    const { name, type, value } = e.target;
    const val = type === 'number' ? parseFloat(value) : value;
    this.setState({ [name]: val });
  };

  render() {
    const { contacttask } = this.state;
    const { handleSignOut } = this.props;
    const { person } = this.state;
    const {accountsnames} = this.state;
    const { username } = this.state;
    const loading = false;
    const error = false;
    if (this.state.saved) {
      //return <Redirect to={`/contact?id=${this.state.id}`} />;
      return <Redirect to={`/accounttasks`} />;
    }
    return !isSignInPending() ? (
      <div>
        <Nav
          profileImage={
            person.avatarUrl() ? person.avatarUrl() : avatarFallbackImage
          }
          logout={handleSignOut.bind(this)}
        />
        <div className="mw9 center ph3 cf">
          <h1>Edit Account Task</h1>
          <div className="w-70-l fl">
            <Form
              onSubmit={async e => {
                e.preventDefault();
                this.handleEditContactSubmit(e);
              }}
            >
              <Error error={error} />
              <fieldset>
                <label htmlFor="contactname">
                  Account Name
                  <select onChange={this.handleChange} id="contactname" name="contactname">
                  <option value="">
                    {this.state.contactname}
                  </option>
                   {
                    accountsnames.map(function(X) {
                    return <option>{X}</option>;
                    })
                   }  
                 </select>
                </label>
              </fieldset>
              <fieldset>
                <label htmlFor="subject">
                  Subject
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    placeholder="Subject.."
                    value={this.state.subject}
                    onChange={this.handleChange}
                  />
                </label>
              </fieldset>
              <fieldset>
                <label htmlFor="duedate">
                  Due Date
                  <input
                    type="date"
                    id="duedate"
                    name="duedate"
                    placeholder="Click to select Due Date.."
                    value={this.state.duedate}
                    onChange={this.handleChange}
                  />
                </label>
              </fieldset>
              <fieldset>
                <label htmlFor="rank">
                  Priority
                  <select
                    type="text"
                    id="rank"
                    name="rank"
                    value={this.state.rank}
                    onChange={this.handleChange}
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </label>
              </fieldset>
              <fieldset>
                <label htmlFor="status">
                  Status
                  <select
                    type="text"
                    id="status"
                    name="status"
                    value={this.state.status}
                    onChange={this.handleChange}
                  >
                    <option value="Deferred">Deferred</option>
                    <option value="InProgress">InProgress</option>
                    <option value="Completed">Completed</option>
                    <option value="Waiting">Waiting</option>
                  </select>
                </label>
              </fieldset>
              <fieldset>
                <label htmlFor="description">
                  Description
                  <input
                    type="text"
                    id="description"
                    name="description"
                    placeholder="Description.."
                    value={this.state.description}
                    onChange={this.handleChange}
                  />
                </label>
              </fieldset>
              <a
                className="pointer link dim ba bw1 ph2 pv2 mb2 dib no-underline ba b--white white mr2 bg-black"
                onClick={() => {
                  this.deleteContact();
                }}
              >
                Delete
              </a>
              <button type="submit" className="bg-black">
                Submit
              </button>
            </Form>
          </div>
        </div>
      </div>
    ) : null;
  }
}

const EditAccountTask = withRouter(EditAccountTaskPage);

export default EditAccountTask;
