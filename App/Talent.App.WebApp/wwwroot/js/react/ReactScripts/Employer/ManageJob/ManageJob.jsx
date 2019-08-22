import React from 'react';
import ReactDOM from 'react-dom';
import Cookies from 'js-cookie';
import LoggedInBanner from '../../Layout/Banner/LoggedInBanner.jsx';
import { LoggedInNavigation } from '../../Layout/LoggedInNavigation.jsx';
import { JobSummaryCard } from './JobSummaryCard.jsx';
import { BodyWrapper, loaderData } from '../../Layout/BodyWrapper.jsx';
import moment from 'moment';
import { Pagination, Icon, Dropdown, Checkbox, Accordion, Form, Segment, CardGroup, Card, Label, Button } from 'semantic-ui-react';

//

export default class ManageJob extends React.Component {
    constructor(props) {
        super(props);
        let loader = loaderData
        loader.allowedUsers.push("Employer");
        loader.allowedUsers.push("Recruiter");
        this.state = {
            loadJobs: [{
                title: '',
                summary: '',
                location: { country: '', city: '' }
            }],
            loaderData: loader,
            activePage: 1,
            sortBy: {
                date: "desc"
            },
            filter: {
                showActive: true,
                showClosed: false,
                showExpired: true,
                showUnexpired: true
            },
            totalPages: 1,
            activeIndex: ""
        }
        this.loadData = this.loadData.bind(this);
        this.init = this.init.bind(this);
        this.loadNewData = this.loadNewData.bind(this);
               
    };

    init() {
        //After getting data make false isLoading
        this.loadData(() =>
            this.setState({ loaderData }),
            loaderData.isLoading = false
        )
       
        }

    componentDidMount() {
        this.init();
        
    };

    loadData(callback) {
     
        var cookies = Cookies.get('talentAuthToken');
        // your ajax call and other logic goes here

        $.ajax({
            url: 'https://madutalentservicestalent.azurewebsites.net/listing/listing/getSortedEmployerJobs',
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            type: "GET",
            contentType: "application/json",
            data: {
                activePage: this.state.activePage,
                sortbyDate: this.state.sortBy.date,
                showActive: this.state.filter.showActive,
                showClosed: this.state.filter.showClosed,
                showExpired: this.state.filter.showExpired,
                showUnexpired: this.state.filter.showUnexpired

            },
            dataType: "json",
            success: function (result) {

                if (result.myJobs) {
                    this.state.loadJobs = result.myJobs
                        
                }
                console.log("result", this.state.loadJobs)
                callback();
            }.bind(this),

            error: function (res) {
                console.log("error");
                callback();
            }
        })
        
    }

    loadNewData(data) {
        var loader = this.state.loaderData;
        loader.isLoading = true;
        data[loaderData] = loader;
        this.setState(data, () => {
            this.loadData(() => {
                loader.isLoading = false;
                this.setState({
                    loadData: loader
                })
            })
        });
    }

    render() {
        let loadJobs = this.state.loadJobs;
        let jobCard = null;
        if (loadJobs != "") {
            jobCard = loadJobs.map((item, index) => (
                <Card key={index}>

                    <Card.Content>
                        <Card.Header>{item.title}</Card.Header>
                        <a className="ui black right ribbon label"><i className="user icon"></i></a>
                        <Card.Meta>{item.location.city},{item.location.country}</Card.Meta>
                        {/* <Card.Meta> Expirys On: {moment(item.expiryDate).format('LL')}</Card.Meta> */}
                        <Card.Description>{item.summary}</Card.Description>

                    </Card.Content>
                    <Card.Content extra>
                       
                        <Button color="red" floated="left" size="mini">Expired</Button>
                        <Button.Group floated="right" size="mini">
                            <Button className="ui blue basic"><Icon name="ban" />Close</Button>
                            <Button className="ui blue basic"><Icon name="edit" />Edit</Button>
                            <Button className="ui blue basic"><Icon name="copy" />Copy</Button>
                        </Button.Group>
                       
                    </Card.Content>
                </Card>
            )
            )
        }
    

        return (
            <BodyWrapper loaderData={this.state.loaderData} reload={this.init}>
                <section className="page-body">
                    <div className="ui container">
                        <div className="ui container">
                            <h1>List of Jobs</h1>
                            {/* //Filter Active and Close Job */}
                <i className="filter icon"></i> Filter: <b> Choose filter</b>

                <div className="caret down icon ui simple dropdown item">
                    <i className="caret down icon"></i>
                    <div className="menu">
                         <div className="item" >Active Jobs</div>
                         <div className="item" >Closed Jobs</div>
                    </div>
                </div>
{/* //Sort by oldest and newest Item */}
                            
                <i className="ui calendar left calendar icon"></i>
             Sort By Jobs: <b>Newest </b>
                <div className="caret down icon ui simple dropdown item">
                      
                    <i className="caret down icon"></i>
                    <div className="menu">
                      <div className="item" > Newest Jobs </div>
                      <div className="item">  Oldest Job  </div>
                    </div>
                    <br/>
                </div>

  {/* //Card Showing here */}
                       
                            <div className="ui three cards" style={{margin:10}}>
                                                       
                                    {                                       
                                        jobCard?jobCard:<span >No Jobs Found</span>
                                        
                                    }
                              
                            </div>
                            {/*card sample*/}

                         {/* Pagination Start */}
                            

                            <div align="center">
                            <Pagination
                                ellipsisItem={{ content: <Icon name='ellipsis horizontal' />, icon: true }}
                                firstItem={{ content: <Icon name='angle double left' />, icon: true }}
                                lastItem={{ content: <Icon name='angle double right' />, icon: true }}
                                prevItem={{ content: <Icon name='angle left' />, icon: true }}
                                nextItem={{ content: <Icon name='angle right' />, icon: true }}
                                totalPages={this.state.totalPages}
                                // activePage= {  jobCard?1:null}
                                activePage= {  jobCard?this.state.activePage:null}
                                                                 
                            />
                </div> 
                            {/* End of Pagiantion */}
                           
                        </div>
                    </div>
                </section>
            </BodyWrapper>
        );
    }
}