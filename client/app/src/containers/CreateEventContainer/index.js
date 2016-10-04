import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as CreateEventActionCreators from './actions';
import cssModules from 'react-css-modules';
import styles from './index.module.scss';
import Section from 'grommet-udacity/components/Section';
import Heading from 'grommet-udacity/components/Heading';
import { EventForm, LoadingIndicator, ToastMessage } from 'components';
import { reduxForm } from 'redux-form';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import validation from './utils/validations';

export const formFields = [
  'nameInput',
  'startDateInput',
  'endDateInput',
  'typeInput',
  'hostInput',
  'locationInput',
  'guestsInput',
  'messageInput',
];

class CreateEvent extends Component {
  constructor() {
    super();
    this.handleClear = this.handleClear.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleAddingGuest = this.handleAddingGuest.bind(this);
    this.handleRemovingGuest = this.handleRemovingGuest.bind(this);
  }
  handleClear(type) {
    const {
      clearCreateEventToast,
    } = this.props.actions;
    clearCreateEventToast(type);
  }
  handleSubmit() {
    const {
      actions,
      mutate,
      fields,
      guestList,
    } = this.props;
    const variables = {
      variables: CreateEventActionCreators.fieldsToData(fields, guestList),
    };
    mutate(variables)
      .then(res => {
        if (!res.data) {
          throw new Error('An error has occured.');
        }
        actions.createEventMessage('Event submitted successfully. Redirecting back to event page.');
        setTimeout(() => {
          this.context.router.push('/events');
        }, 4000);
      })
      .catch(err => {
        actions.createEventError(err.message || 'An unknown error has occured');
      });
  }
  handleAddingGuest(name) {
    const {
      createEventAddGuest,
    } = this.props.actions;
    createEventAddGuest(name);
  }
  handleRemovingGuest(index) {
    const {
      createEventRemoveGuest,
    } = this.props.actions;
    createEventRemoveGuest(index);
  }
  render() {
    const {
      fields,
      guests,
      hosts,
      loading,
      eventTypes,
      error,
      message,
      guestList,
    } = this.props;
    return (
      <Section className={styles.createEvent}>
        <Heading align="center">
          Create an Event
        </Heading>
        {loading ?
          <LoadingIndicator isLoading={loading} />
        :
          <EventForm
            {...fields}
            onAddGuest={this.handleAddingGuest}
            onRemoveGuest={this.handleRemovingGuest}
            guestList={guestList}
            eventTypes={eventTypes}
            pastHosts={hosts}
            pastGuests={guests}
            onSubmit={this.handleSubmit}
          />
        }
        {error &&
          <ToastMessage
            status="critical"
            message={error}
            onClose={() => this.handleClear('error')}
          />
        }
        {message &&
          <ToastMessage
            message={message}
            onClose={() => this.handleClear('message')}
          />
        }
      </Section>
    );
  }
}

CreateEvent.propTypes = {
  submitEvent: PropTypes.func.isRequired,
  mutate: PropTypes.func.isRequired,
  fields: PropTypes.object.isRequired,
  eventTypes: PropTypes.array,
  guests: PropTypes.object,
  hosts: PropTypes.object,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string,
  message: PropTypes.string,
  actions: PropTypes.object.isRequired,
  guestList: PropTypes.array,
};

CreateEvent.contextTypes = {
  router: PropTypes.func.isRequired,
};

// mapStateToProps :: {State} -> {Props}
const mapStateToProps = (state) => ({
  error: state.createEventContainer.error,
  message: state.createEventContainer.message,
  guestList: state.createEventContainer.guestList,
});

// mapDispatchToProps :: Dispatch -> {Action}
const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(
    CreateEventActionCreators,
    dispatch
  ),
});

const Container = cssModules(CreateEvent, styles);

const createEventQuery = gql`
  query createEvent{
    hosts {
      name
    }
    guests {
      name
    }
    eventTypes
  }
`;

const createEventMutation = gql`
mutation createEvent($name: String!, $message: String,
  $start: String!, $end: String!, $type:String!,
    $host: HostInput, $guests: [GuestInput]) {
      CreateEvent(input: { name: $name, message: $message, start_date: $start,
        end_date: $end, host: $host, type: $type, guests: $guests}) {
          event {
            id
            name
            type: event_type
            guests {
              name
            }
            host {
              name
            }
          }
        }
      }
`;

const FormContainer = reduxForm({
  form: 'CreateEvent',
  fields: formFields,
  validate: validation,
})(Container);

const ContainerWithData = graphql(createEventQuery, {
  props: ({ data: { guests, eventTypes, hosts, loading } }) => ({
    loading,
    guests,
    eventTypes,
    hosts,
  }),
})(FormContainer);

const ContainerWithMutations = graphql(createEventMutation)(ContainerWithData);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ContainerWithMutations);