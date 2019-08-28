export default {
  solid: {
    height: 1,
    backgroundColor: '#999',
    marginLeft: 15,
    marginRight: 15,
    marginTop: 8,
    marginBottom: 8
  },
  container: {
    flex: 1,
    backgroundColor: `#ddd`
  },

  firstView: {
    container: {
      flexDirection: 'row',
      marginLeft: 25,
      marginTop: 10,
      marginBottom: 6
    },
    left: {
      imgSize: { width: 60, height: 80 }
    },
    right: {
      container: { marginLeft: 15, justifyContent: 'space-around' },
      tit: { fontSize: 18 },
      subDes: { fontSize: 14, color: '#808080' }
    }
  },
  secondView: {
    container: {
      flexDirection: 'row',
      marginVertical: 8,
      justifyContent: 'space-between',
      paddingHorizontal: 10
    },
    firstButton: {
      text: { color: '#dd0007', fontSize: 15 },
      disText: { color: '#ddd', fontSize: 15 },
      buttonStyle: {
        backgroundColor: 'transparent',
        borderRadius: 4,
        borderColor: '#dd0007',
        borderWidth: 1,
        width: 140,
        height: 40
      },
      disabledStyle: {
        backgroundColor: '#808080',
        borderRadius: 4,
        borderColor: '#808080',
        borderWidth: 1,
        width: 140,
        height: 40
      }
    },
    secondButton: {
      text: { color: '#ddd', fontSize: 15 },
      buttonStyle: {
        backgroundColor: '#dd0007',
        borderRadius: 4,
        width: 140,
        height: 40
      }
    }
  },
  Desc: {
    marginLeft: 20,
    marginBottom: 6,
    marginTop: 6,
    marginRight: 20
  }
};
