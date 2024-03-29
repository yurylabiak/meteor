import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

Meteor.publishComposite('myMenu', function() {
  return {
    find: function() {
      return Profile.find({ profID: this.userId }, { limit: 1 });
    },
    children: [{
      find: function(profile) {
        return ProfileImg.collection.find({ 'meta.userId': this.userId },{
          fields: {
            name: false,
            extension: false,
            path: false,
            type: false,
            size: false,
            versions: false,
            isVideo: false,
            isAudio: false,
            isImage: false,
            isText: false,
            isJSON: false,
            isPDF: false,
            _storagePath: false,
            public: false
          },
          limit: 1
        });
      }
    },{
      find: function(profile) {
        return Messages.find({ for: this.userId, read: false });
      }
    }, {
      find: function(profile) {
        return Feeds.find({ userID: this.userId, read: false }, { fields: { userID: true, read: true } });
      }
    }, {
      find: function(profile) {
        return UserSearchCards.find({ userId: this.userId },{ limit: 1 });
      }
    }, {
      find: function(profile) {
        return Stores.find({ userId: this.userId });
      },
      children: [{
        find: function(profile, store) {

          return StoreImage.collection.find({ 'meta.storeId': store._id },{
            fields: {
              name: false,
              extension: false,
              path: false,
              type: false,
              size: false,
              versions: false,
              isVideo: false,
              isAudio: false,
              isImage: false,
              isText: false,
              isJSON: false,
              isPDF: false,
              _storagePath: false,
              public: false
            },
            limit: 1
          });
          
        }
      }]
    }]
  }
});

Meteor.publish('unreadCount', function() {
  if(!this.userId){
    return;
  }

  return [
    Messages.find({ 
      for: this.userId, 
      read: false 
    }, { 
      fields: {
        for: true,
        read: true
      }
    }),
    Offers.find({
      seller: this.userId,
      read: false
    }, {
      fields: {
        seller: true,
        read: true
      }
    })
  ]
});

Meteor.publishComposite('myFeedback', function(setlimit){
  check(setlimit, Match.Integer);
  return{
    find: function() {
      return Feedback.find({
        user: this.userId
      },{
        sort: { postDate: -1 },
        limit: setlimit,
        fields: { chatID: false }
      })
    },
    children: [{
      find: function(feedback){
        return Profile.find({
          profID: feedback.postBy
        },{
          fields: {
            myOffers: false,
            myListings: false,
            productSold: false,
            badRating: false,
            goodRating: false,
            location: false
          },
          limit: 1
        });
      }
    },{
      find: function(feedback){
        return ProfileImg.collection.find({ 'meta.userId': feedback.postBy },{
          fields: {
            name: false,
            extension: false,
            path: false,
            type: false,
            size: false,
            versions: false,
            isVideo: false,
            isAudio: false,
            isImage: false,
            isText: false,
            isJSON: false,
            isPDF: false,
            _storagePath: false,
            public: false
          },
          limit: 1
        });
      }
    }]
  }
});

Meteor.publishComposite('activities', function(setlimit){
  check(setlimit, Match.Integer);
  return {
    find: function() {
      return Feeds.find({
        userID: this.userId
      },{
        limit: setlimit,
        sort: { postDate: -1 }
      })
    },
    children: [{
      find: function(feed) {
        if ( feed.linkType === 'product' || feed.linkType === 'mypost' ) {
          return  Listings.find({
            _id: feed.linkID,
            active: true
          },{
            fields: {
              _id: true,
              active: true
            },
            sort: { postDate: -1 },
            limit: 1
          });
        }
      }
    }]
  }
});

Meteor.publish('myPack', function(){
  if(!this.userId){
    return;
  }
  check(this.userId, String);

  return UserPack.find({ userId: this.userId },{ limit: 1 });
});

Meteor.publish('myCardsPage', function(){
  if(!this.userId) {
    return;
  }
  check(this.userId, String);

  return [
    Coins.find({ userId: this.userId },{ limit: 1 }),
    UserCards.find({ userId: this.userId },{ 
      limit: 1 ,
      fields: {
        level: true,
        userId: true
      }
    })
  ]
});

Meteor.publish('searchCardsPage', function() {
  return [
    SearchCards.find(),
    Coins.find({ userId: this.userId },{ limit: 1 }),
    UserPack.find({ userId: this.userId }, { limit: 1})
  ]
});