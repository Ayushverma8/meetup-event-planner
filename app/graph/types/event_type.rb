EventType = GraphQL::ObjectType.define do
  name 'Event'
  description 'A event entry'
  field :id, types.ID, 'The id of this event'
  field :name, types.String, 'The title of this event'
  field :start_date, types.String, 'The start date / time'
  field :end_date, types.String, 'The end date / time'
  field :message, types.String, 'Optional message to the guests'
  field :type, EventTypeEnum, 'The type of event'
  field :host, HostType, 'The host of the event'
end