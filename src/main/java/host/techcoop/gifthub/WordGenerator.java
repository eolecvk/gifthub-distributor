package host.techcoop.gifthub;

import com.google.common.collect.ImmutableList;
import com.google.inject.Inject;
import com.google.inject.name.Named;
import java.util.List;
import java.util.Random;

public class WordGenerator {

  private final ImmutableList<String> words;
  private final Random random;

  @Inject
  public WordGenerator(@Named("WordList") List<String> wordList, Random random) {
    this.random = random;
    words =
        wordList.stream()
            .filter(word -> word.length() > 3)
            .filter(word -> word.toLowerCase().equals(word))
            .collect(ImmutableList.toImmutableList());
  }

  public String getWords(int numOfWords, String joiningCharacter) {
    return random
        .ints(numOfWords, 0, words.size())
        .mapToObj(x -> words.get(x))
        .reduce((a, b) -> a + joiningCharacter + b)
        .get();
  }
}
